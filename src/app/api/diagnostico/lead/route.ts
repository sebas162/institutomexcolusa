import { NextResponse } from "next/server";
import { z } from "zod";
import { CalcomError, createCalBooking } from "@/lib/calcom";
import {
  createLeadAdmin,
  getLeadAdmin,
  updateLeadBookingAdmin,
  updateLeadInputAdmin,
} from "@/lib/firestore/leads-admin";
import { getAgendaDays, isSlotInAgenda } from "@/lib/diagnostico/agenda-window";
import {
  DIAGNOSTICO_FORM_ID,
  DIAGNOSTICO_QUESTIONS,
  isExitAnswer,
  type DiagnosticoQuestion,
} from "@/lib/diagnostico/questions";
import { toE164 } from "@/lib/diagnostico/schema";
import { DIAGNOSTICO_TIME_ZONES } from "@/lib/diagnostico/slots";
import type { CreateLeadInput, LeadAnswer, LeadUtm } from "@/types/lead";

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
  slotStart: z.string().datetime({ offset: true }),
  timeZone: z
    .string()
    .refine((id) => DIAGNOSTICO_TIME_ZONES.some((zone) => zone.id === id), {
      message: "invalid_time_zone",
    }),
  // Reintento tras un horario ocupado: el lead ya creado se reutiliza.
  leadId: z.string().regex(/^[A-Za-z0-9]{1,64}$/).optional(),
  confirmationCode: z.string().max(8).optional(),
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

/** Resumen corto para la anfitriona, en las notas de la reserva de Cal.com. */
function buildBookingNotes(
  input: CreateLeadInput,
  phoneE164: string
): string {
  const labels = (questionId: string) =>
    input.answers.find((answer) => answer.questionId === questionId)?.labels.join(", ") ?? "";

  return [
    `Clínica: ${input.clinica}`,
    `Ciudad: ${input.ciudad}`,
    `Establecimiento: ${labels("q2")}`,
    `Equipo: ${labels("q3")}`,
    `Ayuda: ${labels("q4")}`,
    `Inversión: ${labels("q6")}`,
    `Urgencia: ${labels("q7")}`,
    `WhatsApp: ${phoneE164}`,
  ].join(" · ");
}

function logError(context: string, error: unknown) {
  console.error(context, error instanceof Error ? error.message : error);
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

  const leadInput: CreateLeadInput = {
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
    timeZone: data.timeZone,
  };
  const slotStart = new Date(data.slotStart).toISOString();

  // 1. El horario tiene que seguir libre y dentro de la ventana (festivos incluidos).
  try {
    const days = await getAgendaDays();
    if (!isSlotInAgenda(days, slotStart)) {
      return NextResponse.json({ error: "slot_unavailable" }, { status: 409 });
    }
  } catch (error) {
    logError("Error revalidating diagnostico slot:", error);
    return NextResponse.json({ error: "slots_unavailable" }, { status: 503 });
  }

  // 2. Lead nuevo, o el mismo lead si es un reintento con otro horario.
  let leadId: string;
  let confirmationCode: string;

  try {
    const existing =
      data.leadId && data.confirmationCode ? await getLeadAdmin(data.leadId) : null;

    if (
      existing &&
      existing.status === "nuevo" &&
      existing.booking === null &&
      existing.confirmationCode === data.confirmationCode
    ) {
      await updateLeadInputAdmin(existing.id, leadInput);
      leadId = existing.id;
      confirmationCode = existing.confirmationCode;
    } else {
      const created = await createLeadAdmin(leadInput);
      leadId = created.id;
      confirmationCode = created.confirmationCode;
    }
  } catch (error) {
    logError("Error saving diagnostico lead:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  // 3. Reserva en Cal.com. Si falla, el lead queda en "nuevo" (lead abandonado en el panel).
  const phoneE164 = toE164(data.whatsappCountryCode, data.whatsappNumber);
  let booking: { uid: string; start: string; end: string };

  try {
    booking = await createCalBooking({
      startUtc: slotStart,
      name: data.nombre,
      email: data.email,
      phoneE164,
      timeZone: data.timeZone,
      leadId,
      notes: buildBookingNotes(leadInput, phoneE164),
    });
  } catch (error) {
    if (error instanceof CalcomError && error.code === "slot_unavailable") {
      return NextResponse.json(
        { error: "slot_unavailable", leadId, confirmationCode },
        { status: 409 }
      );
    }

    logError("Error creating Cal.com booking:", error);

    // En un choque simultáneo Cal.com puede responder con un error genérico: si el horario
    // ya no está libre, para el visitante es lo mismo que un horario ocupado.
    const slotStillFree = await getAgendaDays()
      .then((days) => isSlotInAgenda(days, slotStart))
      .catch(() => true);

    if (!slotStillFree) {
      return NextResponse.json(
        { error: "slot_unavailable", leadId, confirmationCode },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "booking_failed", leadId, confirmationCode },
      { status: 502 }
    );
  }

  // 4. La reserva ya existe: si Firestore falla aquí, el webhook BOOKING_CREATED la completa.
  try {
    await updateLeadBookingAdmin(leadId, {
      status: "agendada",
      booking: {
        uid: booking.uid,
        startTime: new Date(booking.start),
        endTime: new Date(booking.end),
      },
      timeZone: data.timeZone,
    });
  } catch (error) {
    logError("Error saving booking on diagnostico lead:", error);
  }

  return NextResponse.json(
    { leadId, confirmationCode, booking: { start: booking.start, end: booking.end } },
    { status: 201 }
  );
}
