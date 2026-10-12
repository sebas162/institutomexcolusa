// Plantillas de WhatsApp del panel. Para cambiar un texto, edita solo `text`.
// Variables disponibles: {nombre}, {fecha}, {hora}, {zona}. Fecha, hora y zona salen de la cita
// en la zona horaria del cliente (la que eligió en la agenda).

import { getTimeZoneLabel } from "@/lib/diagnostico/slots";
import type { Lead } from "@/types/lead";
import { CDMX_TIME_ZONE, formatLongDate, formatTime, startOf } from "./lead-utils";

export const WHATSAPP_TEMPLATES = [
  {
    id: "saludo",
    label: "Saludo",
    text: "Hola {nombre}, te escribimos del Instituto Mex-Col-USA sobre tu llamada de diagnóstico del {fecha} a las {hora} (hora {zona}).",
  },
  {
    id: "recordatorio",
    label: "Recordatorio",
    text: "Hola {nombre}, te recordamos tu llamada de diagnóstico hoy a las {hora} (hora {zona}). Te esperamos.",
  },
] as const;

export type WhatsappTemplateId = (typeof WHATSAPP_TEMPLATES)[number]["id"];

export function fillWhatsappTemplate(text: string, lead: Lead): string {
  const start = startOf(lead);
  const timeZone = lead.timeZone || CDMX_TIME_ZONE;
  const values: Record<string, string> = {
    nombre: lead.nombre,
    fecha: start ? formatLongDate(start, timeZone) : "",
    hora: start ? formatTime(start, timeZone) : "",
    zona: getTimeZoneLabel(timeZone),
  };

  return text.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

/** wa.me al número del cliente: lada + 10 dígitos, sin "+" ni espacios. */
export function whatsappLink(lead: Lead, message: string): string {
  const number = `${lead.whatsappCountryCode}${lead.whatsappNumber}`.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
