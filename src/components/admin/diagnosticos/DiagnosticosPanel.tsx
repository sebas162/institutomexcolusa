"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Download, Loader2, RefreshCw, Search, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { MARKETS } from "@/lib/diagnostico/market";
import { subscribeLeads } from "@/lib/firestore/leads-client";
import { cn } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/types/lead";
import { adminFetch } from "./admin-api";
import LeadDetailSheet from "./LeadDetailSheet";
import StatusBadge from "./StatusBadge";
import {
  CDMX_TIME_ZONE,
  FILTERABLE_STATUSES,
  HOUSTON_TIME_ZONE,
  STATUS_META,
  buildCsv,
  computeOrigin,
  computeSummary,
  countryOf,
  filterByView,
  matchesMarket,
  formatPercent,
  formatShortDate,
  formatTime,
  inRange,
  isAlert,
  matchesSearch,
  startOf,
  type DateRange,
  type LeadView,
} from "./lead-utils";

const VIEWS: { id: LeadView; label: string }[] = [
  { id: "hoy", label: "Hoy" },
  { id: "proximas", label: "Próximas" },
  { id: "pasadas", label: "Pasadas" },
  { id: "sin_cita", label: "Sin cita" },
];

const SYNC_STORAGE_KEY = "admin:diagnosticos:ultimaSincronizacion";
const AUTO_SYNC_EVERY_MS = 5 * 60 * 1000;

function readLastSync(): number {
  try {
    return Number(window.localStorage.getItem(SYNC_STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeLastSync(time: number): void {
  try {
    window.localStorage.setItem(SYNC_STORAGE_KEY, String(time));
  } catch {
    // Sin localStorage: la sincronización automática corre en cada visita.
  }
}

function updatedLabel(count: number): string {
  return count === 1 ? "1 cita actualizada" : `${count} citas actualizadas`;
}

// Refresca "ahora" cada minuto: las alertas y "Hoy" dependen de la hora.
function useNow(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function AlertTag() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B45309]">
      <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5" />
      Sin confirmar, faltan menos de 3 h
    </span>
  );
}

function TeamsButton({ lead }: { lead: Lead }) {
  if (!lead.booking?.meetingUrl || lead.status === "cancelada") return null;
  return (
    <Button asChild size="sm" className="gap-1.5" onClick={(event) => event.stopPropagation()}>
      <a href={lead.booking.meetingUrl} target="_blank" rel="noopener noreferrer">
        <Video aria-hidden="true" className="h-4 w-4" />
        Entrar a Teams
      </a>
    </Button>
  );
}

function AppointmentTimes({ lead }: { lead: Lead }) {
  const start = startOf(lead);
  if (!start) return <span className="text-muted-foreground">Sin cita</span>;
  return (
    <div className="flex flex-col leading-tight">
      <span className="font-medium">
        {formatShortDate(start, HOUSTON_TIME_ZONE)} · {formatTime(start, HOUSTON_TIME_ZONE)}{" "}
        <span className="text-xs text-muted-foreground">Houston</span>
      </span>
      <span className="text-sm text-muted-foreground">
        {formatTime(start, CDMX_TIME_ZONE)} CDMX
      </span>
    </div>
  );
}

function SummaryCard({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border bg-white p-4",
        highlight && "border-[#B45309] bg-[#B45309]/5"
      )}
    >
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className={cn("text-2xl font-bold", highlight ? "text-[#B45309]" : "text-primary")}>{value}</span>
    </div>
  );
}

function downloadCsv(leads: Lead[]) {
  const blob = new Blob([buildCsv(leads)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `diagnosticos-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function DiagnosticosPanel() {
  const now = useNow();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [view, setView] = useState<LeadView>("proximas");
  const [statuses, setStatuses] = useState<LeadStatus[]>([]);
  const [range, setRange] = useState<DateRange>({ from: "", to: "" });
  const [search, setSearch] = useState("");
  // "" = todos los países.
  const [market, setMarket] = useState("");
  const [hideTests, setHideTests] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const autoSyncDone = useRef(false);

  // Red de seguridad: compara con Cal.com por si algún webhook no llegó.
  const syncWithCalcom = useCallback(
    async (manual: boolean) => {
      setSyncing(true);
      try {
        const response = await adminFetch(user, "/api/admin/diagnostico/sync/", { method: "POST" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result: { updated: number; errors: number } = await response.json();
        writeLastSync(Date.now());

        if (result.updated > 0) {
          toast({ title: updatedLabel(result.updated) });
        } else if (manual) {
          toast({ title: "Todo al día" });
        }
        if (result.errors > 0) {
          toast({
            variant: "destructive",
            title: "Algunas citas no se pudieron revisar",
            description: "Vuelve a sincronizar en unos minutos.",
          });
        }
      } catch (error) {
        console.error("Error syncing with Cal.com:", error);
        if (manual) toast({ variant: "destructive", title: "No se pudo sincronizar con Cal.com" });
      } finally {
        setSyncing(false);
      }
    },
    [user, toast]
  );

  useEffect(() => {
    if (autoSyncDone.current || !user) return;
    autoSyncDone.current = true;
    if (Date.now() - readLastSync() >= AUTO_SYNC_EVERY_MS) syncWithCalcom(false);
  }, [user, syncWithCalcom]);

  useEffect(
    () =>
      subscribeLeads(
        (next) => {
          setLeads(next);
          setLoadError(false);
        },
        (error) => {
          console.error("Error loading leads:", error);
          setLoadError(true);
        }
      ),
    []
  );

  const all = leads ?? [];
  // Resumen y Origen: siempre sin pruebas y dentro del rango de fechas.
  const realInRange = useMemo(
    () => all.filter((lead) => !lead.isTest && inRange(lead, range) && matchesMarket(lead, market)),
    [all, range, market]
  );
  const summary = useMemo(() => computeSummary(realInRange, now), [realInRange, now]);
  const origin = useMemo(() => computeOrigin(realInRange), [realInRange]);

  const filtered = useMemo(() => {
    const base = all.filter(
      (lead) =>
        (!hideTests || !lead.isTest) &&
        inRange(lead, range) &&
        matchesMarket(lead, market) &&
        (statuses.length === 0 || statuses.includes(lead.status)) &&
        matchesSearch(lead, search)
    );
    return filterByView(base, view, now);
  }, [all, hideTests, range, statuses, search, market, view, now]);

  const selectedLead = all.find((lead) => lead.id === selectedId) ?? null;

  const toggleStatus = (status: LeadStatus) =>
    setStatuses((current) =>
      current.includes(status) ? current.filter((s) => s !== status) : [...current, status]
    );

  if (loadError) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-red-700">
          No se pudieron cargar los diagnósticos. Revisa tu sesión y vuelve a intentarlo.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section aria-label="Resumen" className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {leads === null ? (
          Array.from({ length: 7 }, (_, i) => <Skeleton key={i} className="h-[76px] rounded-xl" />)
        ) : (
          <>
            <SummaryCard label="Citas hoy" value={summary.today} />
            <SummaryCard label="Esta semana" value={summary.thisWeek} />
            <SummaryCard label="Pendientes de confirmar" value={summary.pending} />
            <SummaryCard label="Alertas (< 3 h)" value={summary.alerts} highlight={summary.alerts > 0} />
            <SummaryCard label="% confirmación" value={formatPercent(summary.confirmationRate)} />
            <SummaryCard label="% asistencia" value={formatPercent(summary.attendanceRate)} />
            <SummaryCard label="No asistieron" value={summary.noShows} />
          </>
        )}
      </section>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="diag-search">Buscar</Label>
              <div className="relative">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="diag-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Nombre, teléfono o correo"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="diag-market">País</Label>
              <select
                id="diag-market"
                value={market}
                onChange={(event) => setMarket(event.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Todos</option>
                {MARKETS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="diag-from">Desde</Label>
                <Input id="diag-from" type="date" value={range.from} onChange={(event) => setRange((r) => ({ ...r, from: event.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="diag-to">Hasta</Label>
                <Input id="diag-to" type="date" value={range.to} onChange={(event) => setRange((r) => ({ ...r, to: event.target.value }))} />
              </div>
            </div>
            <div className="flex items-center gap-2 lg:pb-2">
              <Switch id="diag-hide-tests" aria-label="Ocultar pruebas" checked={hideTests} onCheckedChange={setHideTests} />
              <Label htmlFor="diag-hide-tests">Ocultar pruebas</Label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
            {FILTERABLE_STATUSES.map((status) => {
              const active = statuses.includes(status);
              return (
                <button
                  key={status}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleStatus(status)}
                  className={cn(
                    "min-h-9 rounded-full border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-foreground hover:bg-muted"
                  )}
                >
                  {STATUS_META[status].label}
                </button>
              );
            })}
            {(statuses.length > 0 || range.from || range.to || search || market) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatuses([]);
                  setRange({ from: "", to: "" });
                  setSearch("");
                  setMarket("");
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={view} onValueChange={(value) => setView(value as LeadView)}>
          <TabsList>
            {VIEWS.map((v) => (
              // Las pestañas solo filtran la tabla de abajo: no hay un panel por pestaña al que apuntar.
              <TabsTrigger key={v.id} value={v.id} aria-controls={undefined}>
                {v.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => syncWithCalcom(true)} disabled={syncing} className="gap-2">
            {syncing ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
            )}
            Sincronizar con Cal.com
          </Button>
          <Button variant="outline" onClick={() => downloadCsv(filtered)} disabled={filtered.length === 0} className="gap-2">
            <Download aria-hidden="true" className="h-4 w-4" />
            Exportar CSV ({filtered.length})
          </Button>
        </div>
      </div>

      {leads === null ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">No hay diagnósticos con estos filtros.</CardContent>
        </Card>
      ) : (
        <>
          {/* Móvil: tarjetas */}
          <ul className="flex flex-col gap-3 md:hidden">
            {filtered.map((lead) => {
              const alert = isAlert(lead, now);
              return (
                <li key={lead.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(lead.id)}
                    className={cn(
                      "flex w-full flex-col gap-2 rounded-xl border bg-white p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      alert && "border-[#B45309] bg-[#B45309]/5"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-semibold">{lead.nombre}</span>
                        <span className="text-sm text-muted-foreground">
                          {lead.clinica} · {lead.ciudad}, {countryOf(lead)}
                        </span>
                      </div>
                      <StatusBadge status={lead.status} />
                    </div>
                    <AppointmentTimes lead={lead} />
                    {alert && <AlertTag />}
                    {lead.isTest && <span className="text-xs font-semibold text-muted-foreground">Prueba</span>}
                  </button>
                  {view === "hoy" && lead.booking?.meetingUrl && lead.status !== "cancelada" && (
                    <div className="mt-2">
                      <TeamsButton lead={lead} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Escritorio: tabla */}
          <Card className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Clínica</TableHead>
                  <TableHead>Ciudad / país</TableHead>
                  <TableHead>Cita</TableHead>
                  <TableHead>Estado</TableHead>
                  {view === "hoy" && <TableHead className="sr-only">Teams</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lead) => {
                  const alert = isAlert(lead, now);
                  return (
                    <TableRow
                      key={lead.id}
                      onClick={() => setSelectedId(lead.id)}
                      className={cn("cursor-pointer", alert && "bg-[#B45309]/5 hover:bg-[#B45309]/10")}
                    >
                      <TableCell>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedId(lead.id);
                          }}
                          className="text-left font-semibold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {lead.nombre}
                        </button>
                        {lead.isTest && <span className="ml-2 text-xs font-semibold text-muted-foreground">Prueba</span>}
                        {alert && (
                          <div className="mt-1">
                            <AlertTag />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{lead.clinica}</TableCell>
                      <TableCell>
                        {lead.ciudad}, {countryOf(lead)}
                      </TableCell>
                      <TableCell>
                        <AppointmentTimes lead={lead} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={lead.status} />
                      </TableCell>
                      {view === "hoy" && (
                        <TableCell>
                          <TeamsButton lead={lead} />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Origen</CardTitle>
          <p className="text-sm text-muted-foreground">Citas por campaña y anuncio (sin pruebas, dentro del rango de fechas).</p>
        </CardHeader>
        <CardContent>
          {origin.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no hay citas en este rango.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>utm_campaign</TableHead>
                    <TableHead>utm_content</TableHead>
                    <TableHead className="text-right">Citas</TableHead>
                    <TableHead className="text-right">Confirmadas</TableHead>
                    <TableHead className="text-right">Asistieron</TableHead>
                    <TableHead className="text-right">% asistencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {origin.map((row) => (
                    <TableRow key={`${row.campaign}|${row.content}`}>
                      <TableCell className="font-medium">{row.campaign}</TableCell>
                      <TableCell>{row.content}</TableCell>
                      <TableCell className="text-right">{row.bookings}</TableCell>
                      <TableCell className="text-right">{row.confirmed}</TableCell>
                      <TableCell className="text-right">{row.attended}</TableCell>
                      <TableCell className="text-right">{formatPercent(row.attendanceRate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <LeadDetailSheet lead={selectedLead} open={selectedLead !== null} onOpenChange={(open) => !open && setSelectedId(null)} />
    </div>
  );
}
