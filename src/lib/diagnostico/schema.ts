import { z } from "zod";
import { MARKET } from "@/lib/diagnostico/market";

const { datosForm } = MARKET.content;

// Mismas reglas que src/app/api/diagnostico/lead/route.ts
export const DATOS_FIELD_MESSAGES = {
  nombre: "Escribe tu nombre completo (entre 2 y 100 caracteres).",
  whatsappCountryCode: "Usa un número de WhatsApp de México.",
  whatsappNumber: "Escribe tu número de WhatsApp a 10 dígitos.",
  email: "Escribe un correo válido.",
  clinica: datosForm.messages.clinica,
  ciudad: datosForm.messages.ciudad,
  consentConfirmacion:
    "Necesitamos tu consentimiento para confirmar tu cita.",
} as const;

export type DatosFieldName = keyof typeof DATOS_FIELD_MESSAGES;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export const datosSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, DATOS_FIELD_MESSAGES.nombre)
    .max(100, DATOS_FIELD_MESSAGES.nombre),
  // Solo la lada del país de la landing.
  whatsappCountryCode: z.literal(MARKET.phone.countryCode, {
    message: DATOS_FIELD_MESSAGES.whatsappCountryCode,
  }),
  whatsappNumber: z
    .string()
    .max(30, DATOS_FIELD_MESSAGES.whatsappNumber)
    .refine(
      (value) => digitsOnly(value).length === 10,
      DATOS_FIELD_MESSAGES.whatsappNumber
    ),
  email: z
    .string()
    .trim()
    .max(150, DATOS_FIELD_MESSAGES.email)
    .email(DATOS_FIELD_MESSAGES.email),
  clinica: z
    .string()
    .trim()
    .min(2, DATOS_FIELD_MESSAGES.clinica)
    .max(120, DATOS_FIELD_MESSAGES.clinica),
  ciudad: z
    .string()
    .trim()
    .min(2, DATOS_FIELD_MESSAGES.ciudad)
    .max(120, DATOS_FIELD_MESSAGES.ciudad),
  consentConfirmacion: z
    .boolean()
    .refine((value) => value, DATOS_FIELD_MESSAGES.consentConfirmacion),
  consentMarketing: z.boolean(),
  website: z.string(),
});

export type DatosValues = z.infer<typeof datosSchema>;

export const DEFAULT_DATOS_VALUES: DatosValues = {
  nombre: "",
  whatsappCountryCode: MARKET.phone.countryCode,
  whatsappNumber: "",
  email: "",
  clinica: "",
  ciudad: "",
  consentConfirmacion: false,
  consentMarketing: false,
  website: "",
};

// Grupos de dígitos por lada: la del país activo y +1 de leads anteriores.
const PHONE_GROUPS: Record<string, number[]> = {
  "+1": [3, 3, 4],
  ...{ [MARKET.phone.countryCode]: MARKET.phone.groups },
};

/** "+52 55 1234 5678" (o "+1 407 454 0524" en leads anteriores) */
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
