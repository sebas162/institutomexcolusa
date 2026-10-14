// Piezas iguales en todos los países.

import type { DiagnosticoOption } from "./types";

export const OTHER_TEXT_MAX = 120;

export const OTHER_OPTION: DiagnosticoOption = {
  id: "otro",
  label: "Otro (escribe cuál)",
  requiresText: true,
};
