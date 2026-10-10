"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { trackMetaEvent } from "@/lib/analytics/meta-pixel";
import { DIAGNOSTICO_QUESTIONS, isExitAnswer } from "@/lib/diagnostico/questions";
import { DEFAULT_DATOS_VALUES, type DatosValues } from "@/lib/diagnostico/schema";
import {
  AGENDA_TIME_ZONE,
  DEFAULT_TIME_ZONE,
  detectVisitorTimeZone,
  resolveTimeZone,
  toDayKey,
  type Slot,
} from "@/lib/diagnostico/slots";
import type { LeadUtm } from "@/types/lead";

export type AgendaStage = "agenda" | "datos";

/** Lead guardado sin reserva (horario ocupado o error de Cal.com): se reutiliza al reintentar. */
export interface PendingLead {
  leadId: string;
  confirmationCode: string;
}

export interface LeadResult extends PendingLead {
  booking: Slot;
}

/** Lo que necesita la confirmación para sobrevivir a una recarga (sin datos personales). */
export interface StoredConfirmation extends PendingLead {
  slot: Slot;
  timeZone: string;
}

// Avance del flujo: respuestas, zona, horario, UTM y el lead pendiente. Nunca nombre, teléfono ni correo.
const PROGRESS_KEY = "diagnostico:progreso:v1";
const CONFIRMATION_KEY = "diagnostico:confirmacion:v1";

interface StoredProgress {
  answers: Record<string, string[]>;
  timeZone: string;
  selectedSlot: Slot | null;
  utm: LeadUtm;
  pendingLead?: PendingLead | null;
}

function readStorage<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown): void {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sin sessionStorage (modo privado, almacenamiento bloqueado): el flujo sigue en memoria.
  }
}

function removeStorage(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Ver writeStorage.
  }
}

const UTM_PARAMS: Record<string, keyof LeadUtm> = {
  utm_source: "source",
  utm_medium: "medium",
  utm_campaign: "campaign",
  utm_content: "content",
  utm_term: "term",
  fbclid: "fbclid",
};

function readUtmFromUrl(): LeadUtm {
  const params = new URLSearchParams(window.location.search);
  const utm: LeadUtm = {};

  for (const [param, key] of Object.entries(UTM_PARAMS)) {
    const value = params.get(param)?.trim();
    if (value) utm[key] = value.slice(0, 200);
  }

  return utm;
}

/** Las 7 preguntas respondidas con opciones válidas y ninguna de salida. */
export function isQualified(answers: Record<string, string[]>): boolean {
  return DIAGNOSTICO_QUESTIONS.every((question) => {
    const selected = answers[question.id] ?? [];
    const validIds = question.options.map((option) => option.id);
    const countOk = question.multiple ? selected.length >= 1 : selected.length === 1;

    return (
      countOk &&
      selected.every((id) => validIds.includes(id)) &&
      !isExitAnswer(question.id, selected)
    );
  });
}

function firstUnansweredIndex(answers: Record<string, string[]>): number {
  const index = DIAGNOSTICO_QUESTIONS.findIndex(
    (question) => (answers[question.id] ?? []).length === 0
  );
  return index === -1 ? DIAGNOSTICO_QUESTIONS.length - 1 : index;
}

interface DiagnosticoContextValue {
  /** false hasta terminar de leer sessionStorage: las guardias esperan a que sea true. */
  hydrated: boolean;
  answers: Record<string, string[]>;
  questionIndex: number;
  setQuestionIndex: (index: number) => void;
  toggleOption: (questionId: string, optionId: string) => void;
  // Zona en la que se muestran los horarios; se envía a Cal.com al reservar.
  timeZone: string;
  changeTimeZone: (timeZone: string) => void;
  selectedDayKey: string | null;
  selectDay: (dayKey: string) => void;
  selectedSlot: Slot | null;
  setSelectedSlot: (slot: Slot | null) => void;
  agendaStage: AgendaStage;
  setAgendaStage: (stage: AgendaStage) => void;
  datosValues: DatosValues;
  setDatosValues: (values: DatosValues) => void;
  utm: LeadUtm;
  pendingLead: PendingLead | null;
  /** El horario elegido se ocupó: vuelve a la agenda con el aviso y lo guarda para el reintento. */
  markSlotTaken: (pending: PendingLead | null) => void;
  savePendingLead: (pending: PendingLead) => void;
  slotTakenNotice: boolean;
  lead: LeadResult | null;
  storedConfirmation: StoredConfirmation | null;
  completeLead: (result: LeadResult) => void;
  clearProgress: () => void;
  /** Borra respuestas y horario (memoria y sessionStorage): el flujo vuelve a la pregunta 1. */
  resetAnswers: () => void;
}

const DiagnosticoContext = createContext<DiagnosticoContextValue | undefined>(undefined);

export function DiagnosticoProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeZone, setTimeZone] = useState(DEFAULT_TIME_ZONE);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlotState] = useState<Slot | null>(null);
  const [agendaStage, setAgendaStage] = useState<AgendaStage>("agenda");
  const [datosValues, setDatosValues] = useState<DatosValues>(DEFAULT_DATOS_VALUES);
  const [utm, setUtm] = useState<LeadUtm>({});
  const [pendingLead, setPendingLead] = useState<PendingLead | null>(null);
  const [slotTakenNotice, setSlotTakenNotice] = useState(false);
  const [lead, setLead] = useState<LeadResult | null>(null);
  const [storedConfirmation, setStoredConfirmation] = useState<StoredConfirmation | null>(null);

  // Restaura el avance guardado (recarga de la pestaña) y lee las UTM de la URL.
  useEffect(() => {
    const progress = readStorage<StoredProgress>(PROGRESS_KEY);
    const zone = progress?.timeZone ? resolveTimeZone(progress.timeZone) : detectVisitorTimeZone();
    const urlUtm = readUtmFromUrl();

    if (progress) {
      setAnswers(progress.answers ?? {});
      setQuestionIndex(firstUnansweredIndex(progress.answers ?? {}));
      if (progress.selectedSlot) {
        setSelectedSlotState(progress.selectedSlot);
        setSelectedDayKey(toDayKey(new Date(progress.selectedSlot.start), AGENDA_TIME_ZONE));
      }
      setPendingLead(progress.pendingLead ?? null);
    }

    setTimeZone(zone);
    setUtm(Object.keys(urlUtm).length > 0 ? urlUtm : (progress?.utm ?? {}));
    setStoredConfirmation(readStorage<StoredConfirmation>(CONFIRMATION_KEY));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    // Sin avance no se guarda nada. Además evita volver a escribir la clave justo
    // después de que /confirmacion/ o /gracias/ la borran al recargar la página.
    if (Object.keys(answers).length === 0 && !selectedSlot) {
      removeStorage(PROGRESS_KEY);
      return;
    }

    writeStorage(PROGRESS_KEY, {
      answers,
      timeZone,
      selectedSlot,
      utm,
      pendingLead,
    } satisfies StoredProgress);
  }, [hydrated, answers, timeZone, selectedSlot, utm, pendingLead]);

  // El píxel base solo registra PageView en la primera carga; las navegaciones
  // del cliente dentro de /diagnostico se registran aquí.
  const pathname = usePathname();
  const lastPathname = useRef<string | null>(null);

  useEffect(() => {
    if (lastPathname.current === null) {
      lastPathname.current = pathname;
      return;
    }
    if (lastPathname.current !== pathname) {
      lastPathname.current = pathname;
      trackMetaEvent("PageView");
    }
  }, [pathname]);

  const toggleOption = useCallback(
    (questionId: string, optionId: string) => {
      const question = DIAGNOSTICO_QUESTIONS.find((q) => q.id === questionId);
      if (!question) return;

      // Responder la pregunta 1 empieza un flujo nuevo: la confirmación anterior ya no aplica.
      if (questionId === DIAGNOSTICO_QUESTIONS[0].id && (lead || storedConfirmation)) {
        removeStorage(CONFIRMATION_KEY);
        setStoredConfirmation(null);
        setLead(null);
      }

      setAnswers((current) => {
        const previous = current[questionId] ?? [];
        const next = question.multiple
          ? previous.includes(optionId)
            ? previous.filter((id) => id !== optionId)
            : [...previous, optionId]
          : [optionId];
        return { ...current, [questionId]: next };
      });
    },
    [lead, storedConfirmation]
  );

  // Los días de la agenda son fechas de Chicago: cambiar la zona solo cambia cómo se ven las horas.
  const selectDay = useCallback((dayKey: string) => {
    setSelectedDayKey(dayKey);
    setSelectedSlotState(null);
  }, []);

  const setSelectedSlot = useCallback((slot: Slot | null) => {
    setSelectedSlotState(slot);
    setSlotTakenNotice(false);
  }, []);

  const changeTimeZone = useCallback((nextTimeZone: string) => setTimeZone(nextTimeZone), []);

  const savePendingLead = useCallback((pending: PendingLead) => setPendingLead(pending), []);

  const markSlotTaken = useCallback((pending: PendingLead | null) => {
    if (pending) setPendingLead(pending);
    setSelectedSlotState(null);
    setSlotTakenNotice(true);
    setAgendaStage("agenda");
  }, []);

  const completeLead = useCallback(
    (result: LeadResult) => {
      setLead(result);
      setPendingLead(null);
      setSelectedSlotState(result.booking);

      const confirmation: StoredConfirmation = {
        leadId: result.leadId,
        confirmationCode: result.confirmationCode,
        slot: result.booking,
        timeZone,
      };
      writeStorage(CONFIRMATION_KEY, confirmation);
      setStoredConfirmation(confirmation);

      trackMetaEvent("Lead", { content_name: "Llamada diagnóstico" }, result.leadId);
      trackMetaEvent("Schedule", { content_name: "Llamada diagnóstico" }, result.leadId);
    },
    [timeZone]
  );

  const clearProgress = useCallback(() => removeStorage(PROGRESS_KEY), []);

  const resetAnswers = useCallback(() => {
    setAnswers({});
    setQuestionIndex(0);
    setSelectedDayKey(null);
    setSelectedSlotState(null);
    setAgendaStage("agenda");
    setPendingLead(null);
    setSlotTakenNotice(false);
    removeStorage(PROGRESS_KEY);
  }, []);

  return (
    <DiagnosticoContext.Provider
      value={{
        hydrated,
        answers,
        questionIndex,
        setQuestionIndex,
        toggleOption,
        timeZone,
        changeTimeZone,
        selectedDayKey,
        selectDay,
        selectedSlot,
        setSelectedSlot,
        agendaStage,
        setAgendaStage,
        datosValues,
        setDatosValues,
        utm,
        pendingLead,
        markSlotTaken,
        savePendingLead,
        slotTakenNotice,
        lead,
        storedConfirmation,
        completeLead,
        clearProgress,
        resetAnswers,
      }}
    >
      {children}
    </DiagnosticoContext.Provider>
  );
}

export function useDiagnostico(): DiagnosticoContextValue {
  const context = useContext(DiagnosticoContext);
  if (!context) {
    throw new Error("useDiagnostico must be used within a DiagnosticoProvider");
  }
  return context;
}
