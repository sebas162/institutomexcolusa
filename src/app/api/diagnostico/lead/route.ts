import { NextResponse } from "next/server";
import { z } from "zod";
import { createLeadAdmin } from "@/lib/firestore/leads-admin";
import {
  DIAGNOSTICO_FORM_ID,
  DIAGNOSTICO_QUESTIONS,
  isExitAnswer,
  type DiagnosticoQuestion,
} from "@/lib/diagnostico/questions";
import type { LeadAnswer, LeadUtm } from "@/types/lead";

function buildOptionIdsSchema(question: DiagnosticoQuestion) {
  const validIds = question.options.map((option) => option.id);

  const optionIds = z.array(
    z.string().refine((id) => validIds.includes(id), {
      message: "invalid_option",
    })
  );

  return (question.multiple ? optionIds.min(1) : optionIds.length(1)).refine(
    (ids) => new Set(ids).size === ids.length,
    { message: "duplicate_option" }
  );
}

const answersSchema = z.object(
  Object.fromEntries(
    DIAGNOSTICO_QUESTIONS.map((question) => [
      question.id,
      buildOptionIdsSchema(question),
    ])
  )
);

const utmFieldSchema = z.string().trim().max(200).optional();

const leadSchema = z.object({
  nombre: z.string().trim().min(2).max(100),
  whatsappCountryCode: z.enum(["+52", "+1"]),
  whatsappNumber: z
    .string()
    .max(30)
    .transform((value) => value.replace(/\D/g, ""))
    .pipe(z.string().length(10)),
  email: z.string().trim().toLowerCase().email().max(150),
  clinica: z.string().trim().min(2).max(120),
  ciudad: z.string().trim().min(2).max(120),
  answers: answersSchema,
  consentConfirmacion: z.literal(true),
  consentMarketing: z.boolean(),
  utm: z
    .object({
      source: utmFieldSchema,
      medium: utmFieldSchema,
      campaign: utmFieldSchema,
      content: utmFieldSchema,
      term: utmFieldSchema,
      fbclid: utmFieldSchema,
    })
    .optional(),
});

function formatFieldErrors(error: z.ZodError): Record<string, string[]> {
  const fields: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_root";
    fields[key] = [...(fields[key] ?? []), issue.message];
  }

  return fields;
}

// Firestore Admin rechaza valores undefined
function cleanUtm(utm: LeadUtm | undefined): LeadUtm {
  if (!utm) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(utm).filter(([, value]) => value !== undefined && value !== "")
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid", fields: { _root: ["invalid_json"] } },
      { status: 400 }
    );
  }

  // Honeypot: los bots llenan el campo oculto "website"
  if (
    body !== null &&
    typeof body === "object" &&
    "website" in body &&
    typeof body.website === "string" &&
    body.website.trim() !== ""
  ) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", fields: formatFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const answers = data.answers as Record<string, string[]>;

  const isNotQualified = DIAGNOSTICO_QUESTIONS.some((question) =>
    isExitAnswer(question.id, answers[question.id])
  );

  if (isNotQualified) {
    return NextResponse.json({ error: "not_qualified" }, { status: 400 });
  }

  // Textos tomados de questions.ts, nunca del cliente
  const leadAnswers: LeadAnswer[] = DIAGNOSTICO_QUESTIONS.map((question) => {
    const selected = question.options.filter((option) =>
      answers[question.id].includes(option.id)
    );

    return {
      questionId: question.id,
      question: question.text,
      optionIds: selected.map((option) => option.id),
      labels: selected.map((option) => option.label),
    };
  });

  try {
    const { id, confirmationCode } = await createLeadAdmin({
      formId: DIAGNOSTICO_FORM_ID,
      nombre: data.nombre,
      whatsappCountryCode: data.whatsappCountryCode,
      whatsappNumber: data.whatsappNumber,
      email: data.email,
      clinica: data.clinica,
      ciudad: data.ciudad,
      answers: leadAnswers,
      consentConfirmacion: data.consentConfirmacion,
      consentMarketing: data.consentMarketing,
      utm: cleanUtm(data.utm),
    });

    return NextResponse.json({ leadId: id, confirmationCode }, { status: 201 });
  } catch (error) {
    console.error("Error in diagnostico lead route:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
