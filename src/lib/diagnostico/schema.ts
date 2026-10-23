import { z } from "zod";
import { MARKETS, type DiagnosticoMarket } from "@/lib/diagnostico/market";

// Mismas reglas que src/app/api/diagnostico/lead/route.ts
export function getDatosFieldMessages(market: DiagnosticoMarket) {
  const { messages } = market.content.datosForm;

  return {
    nombre: "Escribe tu nombre completo (entre 2 y 100 caracteres).",
    whatsappCountryCode: messages.whatsappCountryCode,
    whatsappNumber: "Escribe tu número de WhatsApp a 10 dígitos.",
    email: "Escribe un correo válido.",
    clinica: messages.clinica,
    ciudad: messages.ciudad,
    consentConfirmacion: "Necesitamos tu consentimiento para confirmar tu cita.",
  } as const;
}

export type DatosFieldName = keyof ReturnType<typeof getDatosFieldMessages>;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function buildDatosSchema(market: DiagnosticoMarket) {
  const fieldMessages = getDatosFieldMessages(market);

  return z.object({
    nombre: z
      .string()
      .trim()
      .min(2, fieldMessages.nombre)
      .max(100, fieldMessages.nombre),
    // Solo la lada del país de la landing.
    whatsappCountryCode: z.literal(market.phone.countryCode, {
      message: fieldMessages.whatsappCountryCode,
    }),
    whatsappNumber: z
      .string()
      .max(30, fieldMessages.whatsappNumber)
      .refine(
        (value) => digitsOnly(value).length === 10,
        fieldMessages.whatsappNumber
      ),
    email: z
      .string()
      .trim()
      .max(150, fieldMessages.email)
      .email(fieldMessages.email),
    clinica: z
      .string()
      .trim()
      .min(2, fieldMessages.clinica)
      .max(120, fieldMessages.clinica),
    ciudad: z
      .string()
      .trim()
      .min(2, fieldMessages.ciudad)
      .max(120, fieldMessages.ciudad),
    consentConfirmacion: z
      .boolean()
      .refine((value) => value, fieldMessages.consentConfirmacion),
    consentMarketing: z.boolean(),
    website: z.string(),
  });
}

export type DatosValues = z.infer<ReturnType<typeof buildDatosSchema>>;

export function getDefaultDatosValues(market: DiagnosticoMarket): DatosValues {
  return {
    nombre: "",
    whatsappCountryCode: market.phone.countryCode,
    whatsappNumber: "",
    email: "",
    clinica: "",
    ciudad: "",
    consentConfirmacion: false,
    consentMarketing: false,
    website: "",
  };
}

// Grupos de dígitos por lada de cada país.
const PHONE_GROUPS: Record<string, number[]> = Object.fromEntries(
  MARKETS.map((market) => [market.phone.countryCode, market.phone.groups])
);

/** "+52 55 1234 5678" o "+1 713 555 1234" */
export function formatWhatsappNumber(countryCode: string, number: string): string {
  const digits = digitsOnly(number);
  const groups = PHONE_GROUPS[countryCode];

  if (digits.length !== 10 || !groups) {
    return `${countryCode} ${number}`;
  }

  let index = 0;
  const formatted = groups
    .map((size) => {
      const part = digits.slice(index, index + size);
      index += size;
      return part;
    })
    .join(" ");

  return `${countryCode} ${formatted}`;
}

/** "+525512345678": formato E.164 que pide Cal.com. */
export function toE164(countryCode: string, number: string): string {
  return `${countryCode}${digitsOnly(number)}`;
}
