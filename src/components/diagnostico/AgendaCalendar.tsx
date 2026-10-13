"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIAGNOSTICO_CONTENT } from "@/lib/diagnostico/content";
import {
  formatDayKeyLabel,
  formatMonthLabel,
  getWeekdayNames,
  toDayKey,
  type AgendaDay,
} from "@/lib/diagnostico/slots";

const texts = DIAGNOSTICO_CONTENT.agenda.calendar;
const WEEKDAYS = getWeekdayNames();

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/** "2026-10" */
function monthOf(dayKey: string): string {
  return dayKey.slice(0, 7);
}

/** Semanas del mes (de lunes a domingo); null es una celda vacía antes del día 1 o después del último. */
function buildWeeks(month: string): (string | null)[][] {
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const leadingBlanks = (new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay() + 6) % 7;

  const cells: (string | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
}

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

interface AgendaCalendarProps {
  /** Los días de la ventana (AGENDA_DAYS); son los únicos que se pueden elegir. */
  days: AgendaDay[];
  selectedDayKey: string | null;
  onSelectDay: (dayKey: string) => void;
  /** Zona del visitante, para marcar "hoy". */
  timeZone: string;
}

export default function AgendaCalendar({
  days,
  selectedDayKey,
  onSelectDay,
  timeZone,
}: AgendaCalendarProps) {
  const availableKeys = useMemo(() => days.map((day) => day.date).sort(), [days]);
  const months = useMemo(() => [...new Set(availableKeys.map(monthOf))], [availableKeys]);

  const [visibleMonth, setVisibleMonth] = useState(() =>
    selectedDayKey && months.includes(monthOf(selectedDayKey))
      ? monthOf(selectedDayKey)
      : (months[0] ?? monthOf(toDayKey(new Date(), timeZone)))
  );

  // Si el día elegido cambia a otro mes (teclado o "Hay otro día disponible"), el calendario lo sigue.
  useEffect(() => {
    if (selectedDayKey && months.includes(monthOf(selectedDayKey))) {
      setVisibleMonth(monthOf(selectedDayKey));
    }
  }, [selectedDayKey, months]);

  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = useRef<string | null>(null);

  useEffect(() => {
    if (pendingFocus.current) {
      buttonRefs.current.get(pendingFocus.current)?.focus();
      pendingFocus.current = null;
    }
  });

  const todayKey = toDayKey(new Date(), timeZone);
  const weeks = buildWeeks(visibleMonth);
  const otherMonth = months.find((month) => month !== visibleMonth) ?? null;
  const otherIsNext = otherMonth !== null && otherMonth > visibleMonth;
  const otherIsPrev = otherMonth !== null && otherMonth < visibleMonth;

  // Un solo día recibe Tab (roving tabindex): el elegido, o el primero disponible de este mes.
  const tabStop =
    selectedDayKey && monthOf(selectedDayKey) === visibleMonth
      ? selectedDayKey
      : availableKeys.find((key) => monthOf(key) === visibleMonth);

  const moveFocus = (target: string | undefined) => {
    if (!target) return;
    pendingFocus.current = target;
    if (monthOf(target) !== visibleMonth) {
      // Al cruzar de mes también se elige: así el mes visible y los horarios de abajo coinciden.
      setVisibleMonth(monthOf(target));
      onSelectDay(target);
    } else {
      buttonRefs.current.get(target)?.focus();
      pendingFocus.current = null;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, dayKey: string) => {
    const index = availableKeys.indexOf(dayKey);
    const keyTargets: Record<string, string | undefined> = {
      ArrowLeft: availableKeys[index - 1],
      ArrowUp: availableKeys[index - 1],
      ArrowRight: availableKeys[index + 1],
      ArrowDown: availableKeys[index + 1],
      Home: availableKeys[0],
      End: availableKeys[availableKeys.length - 1],
    };

    if (event.key in keyTargets) {
      event.preventDefault();
      moveFocus(keyTargets[event.key]);
    }
  };

  const goToOtherMonth = () => {
    if (!otherMonth) return;
    const firstThere = availableKeys.find((key) => monthOf(key) === otherMonth);
    setVisibleMonth(otherMonth);
    if (firstThere) onSelectDay(firstThere);
  };

  const otherMonthName = otherMonth ? lowerFirst(formatMonthLabel(`${otherMonth}-01`).split(" ")[0]) : "";

  const arrowClass = (highlighted: boolean) =>
    cn(
      "flex h-11 w-11 items-center justify-center rounded-full border transition-colors",
      focusRing,
      highlighted
        ? "border-transparent bg-secondary text-secondary-foreground hover:bg-primary/15"
        : "cursor-not-allowed border-border bg-white text-muted-foreground/60"
    );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <strong aria-live="polite" className="text-lg text-primary">
          {formatMonthLabel(`${visibleMonth}-01`)}
        </strong>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={texts.prevMonth}
            disabled={!otherIsPrev}
            onClick={goToOtherMonth}
            className={arrowClass(otherIsPrev)}
          >
            <ChevronLeft aria-hidden="true" className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            aria-label={texts.nextMonth}
            disabled={!otherIsNext}
            onClick={goToOtherMonth}
            className={arrowClass(otherIsNext)}
          >
            <ChevronRight aria-hidden="true" className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      <div role="grid" aria-label={`${texts.label}, ${formatMonthLabel(`${visibleMonth}-01`)}`}>
        <div role="row" className="grid grid-cols-7">
          {WEEKDAYS.map((weekday) => (
            <span
              key={weekday.long}
              role="columnheader"
              aria-label={weekday.long}
              className="py-1 text-center text-xs font-semibold text-muted-foreground"
            >
              {weekday.short}
            </span>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} role="row" className="grid grid-cols-7 gap-y-1">
            {week.map((dayKey, dayIndex) => {
              if (!dayKey) return <span key={`blank-${dayIndex}`} role="gridcell" />;

              const dayNumber = Number(dayKey.slice(8));
              const isAvailable = availableKeys.includes(dayKey);
              const isSelected = dayKey === selectedDayKey;
              const isToday = dayKey === todayKey;
              const label = [
                lowerFirst(formatDayKeyLabel(dayKey)),
                ...(isToday ? [texts.today] : []),
                isAvailable ? texts.available : texts.unavailable,
              ].join(", ");

              if (!isAvailable) {
                return (
                  <span
                    key={dayKey}
                    role="gridcell"
                    aria-disabled="true"
                    aria-label={label}
                    className="relative mx-auto flex h-10 w-10 items-center justify-center text-[15px] text-muted-foreground/60 sm:h-11 sm:w-11"
                  >
                    {dayNumber}
                    {isToday && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary"
                      />
                    )}
                  </span>
                );
              }

              return (
                <span key={dayKey} role="gridcell" aria-selected={isSelected} className="flex">
                  <button
                    ref={(element) => {
                      if (element) buttonRefs.current.set(dayKey, element);
                      else buttonRefs.current.delete(dayKey);
                    }}
                    type="button"
                    tabIndex={dayKey === tabStop ? 0 : -1}
                    aria-label={label}
                    onClick={() => onSelectDay(dayKey)}
                    onKeyDown={(event) => handleKeyDown(event, dayKey)}
                    className={cn(
                      "mx-auto flex h-10 w-10 items-center justify-center rounded-full text-[15px] font-bold transition-colors sm:h-11 sm:w-11",
                      focusRing,
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-primary/15"
                    )}
                  >
                    {dayNumber}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {otherMonth && (
        <button
          type="button"
          onClick={goToOtherMonth}
          className={cn(
            "flex min-h-11 items-center gap-1 self-start rounded-lg text-sm font-semibold text-primary underline-offset-2 hover:underline",
            focusRing
          )}
        >
          {otherIsPrev && <ChevronLeft aria-hidden="true" className="h-4 w-4" />}
          {texts.otherMonth(otherMonthName)}
          {otherIsNext && <ChevronRight aria-hidden="true" className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
