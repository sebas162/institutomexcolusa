import { z } from "zod";

// Mismas reglas que src/app/api/diagnostico/lead/route.ts
export const DATOS_FIELD_MESSAGES = {
  nombre: "Escribe tu nombre completo (entre 2 y 100 caracteres).",
  whatsappCountryCode: "Elige el país de tu número.",
  whatsappNumber: "Escribe tu número de WhatsApp a 10 dígitos.",
  email: "Escribe un correo válido.",
  clinica: "Escribe el nombre de tu clínica (entre 2 y 120 caracteres).",
  ciudad: "Escribe tu ciudad y estado (entre 2 y 120 caracteres).",
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
  whatsappCountryCode: z.enum(["+52", "+1"], {
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
  whatsappCountryCode: "+52",
  whatsappNumber: "",
  email: "",
  clinica: "",
  ciudad: "",
  consentConfirmacion: false,
  consentMarketing: false,
  website: "",
};

/** "+52 55 1234 5678" o "+1 407 454 0524" */
export function formatWhatsappNumber(
  countryCode: DatosValues["whatsappCountryCode"],
  number: string
): string {
  const digits = digitsOnly(number);

  if (digits.length !== 10) {
    return `${countryCode} ${number}`;
  }

  const formatted =
    countryCode === "+52"
      ? `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`
      : `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;

  return `${countryCode} ${formatted}`;
}
