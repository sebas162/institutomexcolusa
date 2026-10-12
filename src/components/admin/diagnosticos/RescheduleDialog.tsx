"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { AgendaDay, Slot } from "@/lib/diagnostico/slots";
import type { Lead } from "@/types/lead";
import { adminFetch } from "./admin-api";
import { CDMX_TIME_ZONE, HOUSTON_TIME_ZONE, formatLongDate, formatTime } from "./lead-utils";

export default function RescheduleDialog({
  lead,
  open,
  onOpenChange,
}: {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [days, setDays] = useState<AgendaDay[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadSlots = useCallback(async () => {
    setDays(null);
    setLoadError(false);
    setSelected(null);
    try {
      const response = await adminFetch(user, "/api/admin/diagnostico/slots/");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: { days: AgendaDay[] } = await response.json();
      setDays(data.days);
    } catch (error) {
      console.error("Error loading admin slots:", error);
      setLoadError(true);
    }
  }, [user]);

  useEffect(() => {
    if (open) loadSlots();
  }, [open, loadSlots]);

  const reschedule = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const response = await adminFetch(user, "/api/admin/diagnostico/booking/", {
        method: "POST",
        body: JSON.stringify({ action: "reschedule", leadId: lead.id, slotStart: selected.start }),
      });

      if (response.status === 409) {
        toast({ variant: "destructive", title: "Ese horario ya no está libre", description: "Elige otro." });
        setConfirming(false);
        loadSlots();
        return;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      toast({ title: "Cita reprogramada", description: "Quedó confirmada. Cal.com le avisa al cliente por correo." });
      setConfirming(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Error rescheduling:", error);
      toast({ variant: "destructive", title: "No se pudo reprogramar", description: "Intenta de nuevo." });
    } finally {
      setSaving(false);
    }
  };

  const daysWithSlots = (days ?? []).filter((day) => day.slots.length > 0);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reprogramar a {lead.nombre}</DialogTitle>
            <DialogDescription>
              Horarios libres de los próximos días hábiles en hora de Houston (CDMX abajo).
            </DialogDescription>
          </DialogHeader>

          {days === null && !loadError && (
            <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              Cargando horarios…
            </div>
          )}
          {loadError && (
            <div className="flex flex-col items-start gap-2 py-4">
              <p className="text-sm text-red-700">No se pudieron cargar los horarios.</p>
              <Button variant="outline" onClick={loadSlots}>
                Reintentar
              </Button>
            </div>
          )}
          {days !== null && daysWithSlots.length === 0 && (
            <p className="py-4 text-sm text-muted-foreground">No hay horarios libres en los próximos días.</p>
          )}

          <div className="flex flex-col gap-5">
            {daysWithSlots.map((day) => (
              <section key={day.date} className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-primary first-letter:uppercase">
                  {formatLongDate(new Date(day.slots[0].start), HOUSTON_TIME_ZONE)}
                </h3>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2">
                  {day.slots.map((slot) => {
                    const isSelected = selected?.start === slot.start;
                    const start = new Date(slot.start);
                    return (
                      <button
                        key={slot.start}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelected(slot)}
                        className={cn(
                          "flex flex-col items-center rounded-lg border px-2 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:bg-muted"
                        )}
                      >
                        <span className="font-semibold">{formatTime(start, HOUSTON_TIME_ZONE)}</span>
                        <span className={cn("text-xs", isSelected ? "text-primary-foreground/80" : "text-muted-foreground")}>
                          {formatTime(start, CDMX_TIME_ZONE)} CDMX
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button disabled={!selected} onClick={() => setConfirming(true)}>
              Reprogramar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirming} onOpenChange={(value) => !saving && setConfirming(value)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Reprogramar la cita?</AlertDialogTitle>
            <AlertDialogDescription>
              {selected &&
                `Nueva cita: ${formatLongDate(new Date(selected.start), HOUSTON_TIME_ZONE)}, ${formatTime(new Date(selected.start), HOUSTON_TIME_ZONE)} Houston (${formatTime(new Date(selected.start), CDMX_TIME_ZONE)} CDMX). `}
              Se cambia en Cal.com, el cliente recibe un correo con el nuevo horario y la cita queda confirmada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Volver</AlertDialogCancel>
            <AlertDialogAction
              disabled={saving}
              onClick={(event) => {
                event.preventDefault();
                reschedule();
              }}
            >
              {saving && <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />}
              Sí, reprogramar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
