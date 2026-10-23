"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Clock, Globe, Video } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import AgendaCalendar from "./AgendaCalendar";
import { cn } from "@/lib/utils";
import type { MarketId } from "@/lib/diagnostico/market";
import {
  formatDayKeyLabel,
  formatSlotTime,
  type AgendaDay,
  type Slot,
} from "@/lib/diagnostico/slots";
import { useMarket } from "./MarketContext";

const pillButton =
  "min-h-[52px] rounded-full text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

type LoadStatus = "loading" | "ready" | "error";

// Si la primera carga falla (por ejemplo, Cal.com tardó), se reintenta sola una vez antes de
// mostrar el aviso; mientras tanto se sigue viendo "Cargando horarios…".
const AUTO_RETRY_DELAY_MS = 1_500;

async function fetchAgendaDays(market: MarketId, signal?: AbortSignal): Promise<AgendaDay[]> {
  const response = await fetch(`/api/diagnostico/slots/?market=${market}`, {
    cache: "no-store",
    signal,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data: { days: AgendaDay[] } = await response.json();
  return data.days;
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

interface AgendaStepProps {
  timeZone: string;
  selectedDayKey: string | null;
  selectedSlot: Slot | null;
  /** Aviso cuando el horario elegido se acaba de ocupar. */
  notice: string | null;
  onSelectDay: (dayKey: string) => void;
  onSelectSlot: (slot: Slot | null) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function AgendaStep({
  timeZone,
  selectedDayKey,
  selectedSlot,
  notice,
  onSelectDay,
  onSelectSlot,
  onBack,
  onContinue,
}: AgendaStepProps) {
  const market = useMarket();
  const { agenda: texts } = market.content;
  const [days, setDays] = useState<AgendaDay[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");

  const loadSlots = useCallback(async (signal?: AbortSignal) => {
    setStatus("loading");
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        setDays(await fetchAgendaDays(market.id, signal));
        setStatus("ready");
        return;
      } catch (error) {
        if (signal?.aborted) return;
        console.error(`Error loading available slots (intento ${attempt}):`, error);
        if (attempt === 1) await wait(AUTO_RETRY_DELAY_MS, signal);
        if (signal?.aborted) return;
      }
    }
    setStatus("error");
  }, [market.id]);

  useEffect(() => {
    const controller = new AbortController();
    loadSlots(controller.signal);
    return () => controller.abort();
  }, [loadSlots]);

  // Al cargar: elige el primer día con horarios y suelta un horario que ya no está libre.
  useEffect(() => {
    if (status !== "ready") return;

    const current = days.find((day) => day.date === selectedDayKey);
    if (!current || current.slots.length === 0) {
      const firstWithSlots = days.find((day) => day.slots.length > 0);
      if (firstWithSlots && firstWithSlots.date !== selectedDayKey) onSelectDay(firstWithSlots.date);
      return;
    }

    if (selectedSlot && !current.slots.some((slot) => slot.start === selectedSlot.start)) {
      onSelectSlot(null);
    }
    // Solo cuando llegan horarios nuevos, no en cada selección.
  }, [status, days]);

  const hasAnySlots = days.some((day) => day.slots.length > 0);
  const selectedDay = days.find((day) => day.date === selectedDayKey);
  const zoneLabel = market.timeZoneLabel;

  // Libres y "Agendado" en un solo orden por hora: un horario ocupado queda en su lugar, en gris.
  const daySlots = useMemo(
    () =>
      selectedDay
        ? [
            ...selectedDay.slots.map((slot) => ({ slot, available: true })),
            ...selectedDay.unavailable.map((slot) => ({ slot, available: false })),
          ].sort((a, b) => a.slot.start.localeCompare(b.slot.start))
        : [],
    [selectedDay]
  );
  const whatsappUrl = `https://wa.me/${market.whatsappNumber}?text=${encodeURIComponent(texts.noSlotsWhatsappMessage)}`;

  return (
    <>
      <div className="flex flex-wrap gap-x-5 gap-y-2.5 border-b border-border pb-5 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Clock aria-hidden="true" className="h-[18px] w-[18px] text-primary" />
          15 minutos exactos
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

      {notice && (
        <p
          role="alert"
          className="rounded-[14px] bg-secondary px-[18px] py-3.5 text-[15px] font-semibold text-secondary-foreground"
        >
          {notice}
        </p>
      )}

      {status === "loading" && (
        <div aria-busy="true" className="flex flex-col gap-4">
          <span className="sr-only">Cargando horarios…</span>
          <div className="flex items-center justify-between">
            <div className="h-6 w-36 rounded-md bg-muted motion-safe:animate-pulse" />
            <div className="flex gap-2">
              <div className="h-11 w-11 rounded-full bg-muted motion-safe:animate-pulse" />
              <div className="h-11 w-11 rounded-full bg-muted motion-safe:animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: 35 }, (_, i) => (
              <div
                key={i}
                className="mx-auto h-10 w-10 rounded-full bg-muted motion-safe:animate-pulse sm:h-11 sm:w-11"
              />
            ))}
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-[46px] rounded-full bg-muted motion-safe:animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {status === "error" && (
        <div
          role="status"
          className="flex flex-col items-start gap-3 rounded-[14px] bg-secondary px-[18px] py-4"
        >
          <p className="text-[15px] text-secondary-foreground">{texts.loadError}</p>
          <button
            type="button"
            onClick={() => loadSlots()}
            className={cn(
              "min-h-11 rounded-full border-[1.5px] border-primary bg-white px-5 text-sm font-bold text-primary transition-colors hover:bg-secondary",
              focusRing
            )}
          >
            {texts.retry}
          </button>
        </div>
      )}

      {status === "ready" && !hasAnySlots && (
        <div className="flex flex-col items-start gap-3">
          <p className="text-[15px] text-foreground">{texts.noSlots}</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 text-base font-bold text-[#0A1416] transition-colors hover:bg-[#20BA5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <FaWhatsapp aria-hidden="true" className="h-5 w-5" />
            {texts.noSlotsWhatsappButton}
          </a>
        </div>
      )}

      {status === "ready" && hasAnySlots && (
        <AgendaCalendar
          days={days}
          selectedDayKey={selectedDayKey}
          onSelectDay={onSelectDay}
          timeZone={timeZone}
        />
      )}

      <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
        <Globe aria-hidden="true" className="h-4 w-4 text-primary" />
        <span>
          Horarios en: <strong className="font-semibold text-foreground">{zoneLabel}</strong>
        </span>
      </p>

      {status === "ready" && hasAnySlots && selectedDay && (
        <div className="flex flex-col gap-3">
          <strong className="text-[15px] text-primary">{formatDayKeyLabel(selectedDay.date)}</strong>
          {selectedDay.slots.length === 0 && (
            <p className="text-sm text-muted-foreground">{texts.emptyDay}</p>
          )}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2">
            {daySlots.map(({ slot, available }) => {
              const time = formatSlotTime(slot, timeZone);

              if (!available) {
                return (
                  <button
                    key={slot.start}
                    type="button"
                    disabled
                    aria-label={`${time}, ${texts.unavailableLabel.toLowerCase()}`}
                    className="flex min-h-[46px] cursor-not-allowed flex-col items-center justify-center rounded-full border-[1.5px] border-border bg-muted leading-tight text-muted-foreground"
                  >
                    <span className="text-[15px] font-semibold">{time}</span>
                    <span className="text-[11px]">{texts.unavailableLabel}</span>
                  </button>
                );
              }

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
                  {time}
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
