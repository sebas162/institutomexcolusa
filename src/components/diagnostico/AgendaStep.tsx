"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Globe, Loader2, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DIAGNOSTICO_TIME_ZONES,
  formatDayKeyLabel,
  formatMonthLabel,
  formatSlotTime,
  getAvailableSlots,
  getTimeZoneLabel,
  toDayKey,
  type Slot,
} from "@/lib/diagnostico/slots";

const WEEKDAYS = [
  { short: "L", long: "Lunes" },
  { short: "M", long: "Martes" },
  { short: "M", long: "Miércoles" },
  { short: "J", long: "Jueves" },
  { short: "V", long: "Viernes" },
  { short: "S", long: "Sábado" },
  { short: "D", long: "Domingo" },
];

const MAX_MONTHS_AHEAD = 2;
const DAY_MS = 24 * 60 * 60 * 1000;

interface MonthRef {
  year: number;
  month: number; // 0-11
}

function monthFromDayKey(dayKey: string): MonthRef {
  const [year, month] = dayKey.split("-").map(Number);
  return { year, month: month - 1 };
}

function monthIndex({ year, month }: MonthRef): number {
  return year * 12 + month;
}

function shiftMonth({ year, month }: MonthRef, delta: number): MonthRef {
  const index = year * 12 + month + delta;
  return { year: Math.floor(index / 12), month: index % 12 };
}

function monthPrefix({ year, month }: MonthRef): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-`;
}

const pillButton =
  "min-h-[52px] rounded-full text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

interface AgendaStepProps {
  timeZone: string;
  selectedDayKey: string | null;
  selectedSlot: Slot | null;
  onTimeZoneChange: (timeZone: string) => void;
  onSelectDay: (dayKey: string) => void;
  onSelectSlot: (slot: Slot) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function AgendaStep({
  timeZone,
  selectedDayKey,
  selectedSlot,
  onTimeZoneChange,
  onSelectDay,
  onSelectSlot,
  onBack,
  onContinue,
}: AgendaStepProps) {
  const todayKey = toDayKey(new Date(), timeZone);
  const currentMonth = monthFromDayKey(todayKey);
  const [visibleMonth, setVisibleMonth] = useState<MonthRef>(() =>
    monthFromDayKey(selectedDayKey ?? todayKey)
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [isChoosingZone, setIsChoosingZone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Un día de margen a cada lado: el mes se arma en la zona elegida, no en UTC.
    const from = Date.UTC(visibleMonth.year, visibleMonth.month, 1) - DAY_MS;
    const to = Date.UTC(visibleMonth.year, visibleMonth.month + 1, 1) + DAY_MS;

    setStatus("loading");
    getAvailableSlots(new Date(Math.max(from, Date.now())), new Date(to))
      .then((result) => {
        if (cancelled) return;
        setSlots(result);
        setStatus("ready");
      })
      .catch((error) => {
        console.error("Error loading available slots:", error);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [visibleMonth]);

  const slotsByDay = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const slot of slots) {
      const key = toDayKey(new Date(slot.start), timeZone);
      map.set(key, [...(map.get(key) ?? []), slot]);
    }
    return map;
  }, [slots, timeZone]);

  const prefix = monthPrefix(visibleMonth);
  const { year, month } = visibleMonth;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const leadingBlanks = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const canGoPrev = monthIndex(visibleMonth) > monthIndex(currentMonth);
  const canGoNext = monthIndex(visibleMonth) < monthIndex(currentMonth) + MAX_MONTHS_AHEAD;
  const hasSlotsThisMonth = [...slotsByDay.keys()].some((key) => key.startsWith(prefix));
  const daySlots = selectedDayKey ? slotsByDay.get(selectedDayKey) : undefined;
  const zoneLabel = getTimeZoneLabel(timeZone);

  return (
    <>
      <div className="flex flex-wrap gap-x-5 gap-y-2.5 border-b border-border pb-5 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Clock aria-hidden="true" className="h-[18px] w-[18px] text-primary" />
          15 minutos
        </span>
        <span className="flex items-center gap-2">
          <Video aria-hidden="true" className="h-[18px] w-[18px] text-primary" />
          Videollamada
        </span>
        <span className="flex items-center gap-2">
          <Globe aria-hidden="true" className="h-[18px] w-[18px] text-primary" />
          {zoneLabel}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <strong aria-live="polite" className="text-lg text-primary">
          {formatMonthLabel(`${prefix}01`)}
        </strong>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Mes anterior"
            disabled={!canGoPrev}
            onClick={() => setVisibleMonth((m) => shiftMonth(m, -1))}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground/60 disabled:hover:bg-white",
              focusRing
            )}
          >
            <ChevronLeft aria-hidden="true" className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            aria-label="Mes siguiente"
            disabled={!canGoNext}
            onClick={() => setVisibleMonth((m) => shiftMonth(m, 1))}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground/60 disabled:hover:bg-white",
              focusRing
            )}
          >
            <ChevronRight aria-hidden="true" className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {WEEKDAYS.map((weekday) => (
            <span key={weekday.long} className="py-1 text-xs font-semibold text-muted-foreground">
              <span aria-hidden="true">{weekday.short}</span>
              <span className="sr-only">{weekday.long}</span>
            </span>
          ))}

          {Array.from({ length: leadingBlanks }, (_, i) => (
            <span key={`blank-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayKey = `${prefix}${String(day).padStart(2, "0")}`;
            const isOpen = status === "ready" && slotsByDay.has(dayKey);
            const isSelected = selectedDayKey === dayKey;

            if (!isOpen) {
              return (
                <span
                  key={dayKey}
                  className="flex h-11 items-center justify-center text-[15px] text-muted-foreground/60"
                >
                  {day}
                </span>
              );
            }

            return (
              <button
                key={dayKey}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${formatDayKeyLabel(dayKey)}, con horarios disponibles`}
                onClick={() => onSelectDay(dayKey)}
                className={cn(
                  "h-11 rounded-full text-[15px] font-bold transition-colors",
                  focusRing,
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/15"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 aria-hidden="true" className="h-6 w-6 animate-spin text-primary" />
            <span className="sr-only">Cargando horarios…</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          <Globe aria-hidden="true" className="h-4 w-4 text-primary" />
          <span>
            Horarios en: <strong className="font-semibold text-foreground">{zoneLabel}</strong>
          </span>
          <button
            type="button"
            aria-expanded={isChoosingZone}
            aria-controls="diagnostico-zona"
            onClick={() => setIsChoosingZone((open) => !open)}
            className={cn(
              "min-h-11 rounded-lg px-2 text-sm font-bold text-primary underline",
              focusRing
            )}
          >
            Cambiar
          </button>
        </div>
        {isChoosingZone && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="diagnostico-zona" className="text-sm font-semibold">
              Zona horaria
            </label>
            <select
              id="diagnostico-zona"
              value={timeZone}
              onChange={(event) => {
                onTimeZoneChange(event.target.value);
                setIsChoosingZone(false);
              }}
              className={cn(
                "min-h-[52px] rounded-xl border-[1.5px] border-input bg-white px-3 text-base text-foreground",
                focusRing
              )}
            >
              {DIAGNOSTICO_TIME_ZONES.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-red-700">
          No pudimos cargar los horarios. Intenta de nuevo en un momento.
        </p>
      )}

      {status === "ready" && !hasSlotsThisMonth && (
        <p className="text-sm text-muted-foreground">
          No hay horarios disponibles este mes. Revisa el mes siguiente.
        </p>
      )}

      {selectedDayKey && daySlots && (
        <div className="flex flex-col gap-3">
          <strong className="text-[15px] text-primary">{formatDayKeyLabel(selectedDayKey)}</strong>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2">
            {daySlots.map((slot) => {
              const isSelected = selectedSlot?.start === slot.start;

              return (
                <button
                  key={slot.start}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectSlot(slot)}
                  className={cn(
                    "min-h-[46px] rounded-full border-[1.5px] border-primary text-[15px] font-semibold transition-colors",
                    focusRing,
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-white text-primary hover:bg-secondary"
                  )}
                >
                  {formatSlotTime(slot, timeZone)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className={cn(
            pillButton,
            "border-[1.5px] border-border bg-white px-[22px] font-semibold text-foreground hover:bg-muted"
          )}
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!selectedSlot}
          className={cn(
            pillButton,
            "bg-primary px-8 font-bold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-border disabled:text-muted-foreground"
          )}
        >
          Continuar
        </button>
      </div>
    </>
  );
}
