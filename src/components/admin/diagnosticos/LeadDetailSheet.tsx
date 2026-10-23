"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CalendarClock, Loader2, MessageCircle, Video, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  setLeadTest,
  updateLeadNote,
  updateLeadStatus,
  type ManualLeadStatus,
} from "@/lib/firestore/leads-client";
import { getTimeZoneLabel } from "@/lib/diagnostico/slots";
import type { Lead } from "@/types/lead";
import ConfirmDialog from "./ConfirmDialog";
import StatusBadge from "./StatusBadge";
import { adminFetch } from "./admin-api";
import RescheduleDialog from "./RescheduleDialog";
import {
  CDMX_TIME_ZONE,
  HOUSTON_TIME_ZONE,
  SOURCE_LABELS,
  STATUS_META,
  countryOf,
  formatDateTime,
  formatLongDate,
  formatTime,
  phoneLabel,
  questionsOf,
  startOf,
} from "./lead-utils";
import { WHATSAPP_TEMPLATES, fillWhatsappTemplate, whatsappLink } from "./whatsapp-templates";

const STATUS_ACTIONS: { status: ManualLeadStatus; label: string; confirm: string }[] = [
  { status: "confirmada", label: "Marcar confirmada", confirm: "¿Marcar la cita como confirmada por WhatsApp?" },
  { status: "asistio", label: "Asistió", confirm: "¿Marcar que el cliente asistió a la llamada?" },
  { status: "no_asistio", label: "No asistió", confirm: "¿Marcar que el cliente no asistió a la llamada?" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-primary">{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,140px)_1fr] gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}

function AppointmentDetail({ lead }: { lead: Lead }) {
  const start = startOf(lead);
  if (!start) return <p className="text-sm text-muted-foreground">Sin cita.</p>;
  const clientZone = lead.timeZone || CDMX_TIME_ZONE;
  return (
    <>
      <Field label="Houston">
        <span className="font-semibold">
          {formatLongDate(start, HOUSTON_TIME_ZONE)}, {formatTime(start, HOUSTON_TIME_ZONE)}
        </span>
      </Field>
      <Field label="CDMX">
        <span className="text-muted-foreground">
          {formatLongDate(start, CDMX_TIME_ZONE)}, {formatTime(start, CDMX_TIME_ZONE)}
        </span>
      </Field>
      {/* Solo leads anteriores, cuando la persona podía elegir otra zona (USA ya es Houston). */}
      {clientZone !== CDMX_TIME_ZONE && clientZone !== HOUSTON_TIME_ZONE && (
        <Field label="Hora del cliente">
          {formatLongDate(start, clientZone)}, {formatTime(start, clientZone)} ({getTimeZoneLabel(clientZone)})
        </Field>
      )}
    </>
  );
}

interface PendingAction {
  title: string;
  description: string;
  run: () => Promise<void>;
  success: string;
}

export default function LeadDetailSheet({
  lead,
  open,
  onOpenChange,
}: {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [running, setRunning] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const leadId = lead?.id;
  useEffect(() => {
    setNote(lead?.adminNote ?? "");
    setCancelReason("");
    // Solo al cambiar de lead: no pisar lo que el equipo está escribiendo.
  }, [leadId]);

  if (!lead) return null;

  const email = user?.email ?? null;
  const start = startOf(lead);
  const hasActiveBooking = Boolean(lead.booking) && lead.status !== "cancelada";

  const runPending = async () => {
    if (!pending) return;
    setRunning(true);
    try {
      await pending.run();
      toast({ title: pending.success });
      setPending(null);
    } catch (error) {
      console.error("Error updating lead:", error);
      toast({ variant: "destructive", title: "No se pudo guardar el cambio", description: "Intenta de nuevo." });
    } finally {
      setRunning(false);
    }
  };

  const saveNote = async () => {
    setSavingNote(true);
    try {
      await updateLeadNote(lead.id, note.trim(), email);
      toast({ title: "Nota guardada" });
    } catch (error) {
      console.error("Error saving note:", error);
      toast({ variant: "destructive", title: "No se pudo guardar la nota" });
    } finally {
      setSavingNote(false);
    }
  };

  const toggleTest = async (isTest: boolean) => {
    try {
      await setLeadTest(lead.id, isTest);
      toast({ title: isTest ? "Marcado como prueba" : "Ya no es prueba" });
    } catch (error) {
      console.error("Error toggling test flag:", error);
      toast({ variant: "destructive", title: "No se pudo cambiar" });
    }
  };

  const cancelBooking = async () => {
    setRunning(true);
    try {
      const response = await adminFetch(user, "/api/admin/diagnostico/booking/", {
        method: "POST",
        body: JSON.stringify({ action: "cancel", leadId: lead.id, reason: cancelReason.trim() }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      toast({ title: "Cita cancelada", description: "Cal.com le avisa al cliente por correo." });
      setCancelOpen(false);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({ variant: "destructive", title: "No se pudo cancelar la cita", description: "Intenta de nuevo." });
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        {/* El Sheet compartido agrega un título oculto genérico: este panel se nombra con el suyo. */}
        <SheetContent
          side="right"
          aria-labelledby="lead-sheet-title"
          className="w-full overflow-y-auto sm:max-w-xl"
        >
          <SheetHeader className="text-left">
            <SheetTitle id="lead-sheet-title" className="flex flex-wrap items-center gap-2 pr-6">
              {lead.nombre}
              <StatusBadge status={lead.status} />
            </SheetTitle>
            <SheetDescription>
              {lead.clinica} · {lead.ciudad}, {countryOf(lead)}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 flex flex-col gap-6">
            <Section title="Cita">
              <AppointmentDetail lead={lead} />
              {lead.booking?.meetingUrl && hasActiveBooking && (
                <Button asChild className="mt-1 self-start gap-2">
                  <a href={lead.booking.meetingUrl} target="_blank" rel="noopener noreferrer">
                    <Video aria-hidden="true" className="h-4 w-4" />
                    Entrar a Teams
                  </a>
                </Button>
              )}
              {hasActiveBooking && (
                <div className="mt-1 flex flex-wrap gap-2">
                  <Button variant="outline" className="gap-2" onClick={() => setRescheduleOpen(true)}>
                    <CalendarClock aria-hidden="true" className="h-4 w-4" />
                    Reprogramar
                  </Button>
                  <Button variant="outline" className="gap-2 text-red-700 hover:text-red-700" onClick={() => setCancelOpen(true)}>
                    <XCircle aria-hidden="true" className="h-4 w-4" />
                    Cancelar cita
                  </Button>
                </div>
              )}
            </Section>

            {lead.booking && (
              <Section title="Estado">
                <div className="flex flex-wrap gap-2">
                  {STATUS_ACTIONS.map((action) => (
                    <Button
                      key={action.status}
                      variant={lead.status === action.status ? "default" : "outline"}
                      disabled={lead.status === action.status || lead.status === "cancelada"}
                      onClick={() =>
                        setPending({
                          title: action.label,
                          description: action.confirm,
                          success: `Estado: ${STATUS_META[action.status].label}`,
                          run: () => updateLeadStatus(lead.id, action.status, email),
                        })
                      }
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </Section>
            )}

            <Section title="WhatsApp">
              <div className="flex flex-wrap gap-2">
                {WHATSAPP_TEMPLATES.map((template) => (
                  <Button key={template.id} asChild variant="outline" className="gap-2">
                    <a href={whatsappLink(lead, fillWhatsappTemplate(template.text, lead))} target="_blank" rel="noopener noreferrer">
                      <MessageCircle aria-hidden="true" className="h-4 w-4" />
                      {template.label}
                    </a>
                  </Button>
                ))}
              </div>
            </Section>

            <Section title="Contacto">
              <Field label="WhatsApp">{phoneLabel(lead)}</Field>
              <Field label="Correo">{lead.email}</Field>
              <Field label="Clínica">{lead.clinica}</Field>
              <Field label="Ciudad">{lead.ciudad}, {countryOf(lead)}</Field>
              <Field label="Zona del cliente">{lead.timeZone ? getTimeZoneLabel(lead.timeZone) : "—"}</Field>
            </Section>

            <Section title="Respuestas">
              <ol className="flex flex-col gap-3">
                {questionsOf(lead).map((question, index) => {
                  const answer = lead.answers.find((a) => a.questionId === question.id);
                  return (
                    <li key={question.id} className="flex flex-col gap-0.5 text-sm">
                      <span className="text-muted-foreground">
                        {index + 1}. {answer?.question ?? question.text}
                      </span>
                      <span className="font-medium">{answer?.labels.join(" · ") || "—"}</span>
                    </li>
                  );
                })}
              </ol>
            </Section>

            <Section title="Nota interna">
              <Textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} placeholder="Solo la ve el equipo." />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {lead.adminNoteUpdatedAt
                    ? `Última edición: ${formatDateTime(lead.adminNoteUpdatedAt)}${lead.adminNoteUpdatedBy ? ` · ${lead.adminNoteUpdatedBy}` : ""}`
                    : "Sin nota todavía."}
                </span>
                <Button onClick={saveNote} disabled={savingNote || note.trim() === (lead.adminNote ?? "").trim()}>
                  {savingNote && <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar nota
                </Button>
              </div>
            </Section>

            <Section title="Historial">
              <ol className="flex flex-col gap-2">
                {[...lead.statusHistory].reverse().map((change, index) => (
                  <li key={index} className="flex flex-col gap-0.5 rounded-lg bg-muted px-3 py-2 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={change.status} />
                      <span className="text-muted-foreground">
                        {formatDateTime(change.at)} · {SOURCE_LABELS[change.source] ?? change.source}
                        {change.email ? ` · ${change.email}` : ""}
                      </span>
                    </div>
                    {change.note && <span>{change.note}</span>}
                  </li>
                ))}
                {lead.statusHistory.length === 0 && <li className="text-sm text-muted-foreground">Sin historial.</li>}
              </ol>
            </Section>

            <Section title="Consentimientos y origen">
              <Field label="Confirmación">{lead.consentConfirmacion ? "Sí" : "No"}</Field>
              <Field label="Marketing">{lead.consentMarketing ? "Sí" : "No"}</Field>
              {(["source", "medium", "campaign", "content", "term", "fbclid"] as const).map((key) => (
                <Field key={key} label={key === "fbclid" ? "fbclid" : `utm_${key}`}>
                  {lead.utm[key] || "—"}
                </Field>
              ))}
            </Section>

            <Section title="Registro">
              <Field label="Creado">{formatDateTime(lead.createdAt)}</Field>
              <Field label="Actualizado">{formatDateTime(lead.updatedAt)}</Field>
              <Field label="Código">{lead.confirmationCode}</Field>
              <Field label="ID del lead">{lead.id}</Field>
              {lead.booking && <Field label="Reserva Cal.com">{lead.booking.uid}</Field>}
              {start && <Field label="Termina">{formatTime(lead.booking!.endTime, HOUSTON_TIME_ZONE)} Houston</Field>}
            </Section>

            <Separator />

            <div className="flex items-center justify-between gap-3 pb-4">
              <Label htmlFor="lead-is-test" className="flex flex-col gap-0.5">
                <span>Es prueba</span>
                <span className="text-xs font-normal text-muted-foreground">No cuenta en el resumen, Origen ni CSV.</span>
              </Label>
              <Switch id="lead-is-test" checked={lead.isTest} onCheckedChange={toggleTest} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(value) => !value && setPending(null)}
        title={pending?.title}
        description={pending?.description}
        confirmLabel="Sí, guardar"
        busy={running}
        onConfirm={runPending}
      />

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancelar la cita"
        description="Se cancela en Cal.com y el cliente recibe un correo con el motivo. No se puede deshacer."
        confirmLabel="Cancelar cita"
        confirmClassName="bg-red-700 text-white hover:bg-red-700/90"
        confirmDisabled={cancelReason.trim().length < 3}
        busy={running}
        onConfirm={cancelBooking}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cancel-reason">Motivo</Label>
          <Textarea id="cancel-reason" value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} rows={3} />
        </div>
      </ConfirmDialog>

      {hasActiveBooking && (
        <RescheduleDialog lead={lead} open={rescheduleOpen} onOpenChange={setRescheduleOpen} />
      )}
    </>
  );
}
