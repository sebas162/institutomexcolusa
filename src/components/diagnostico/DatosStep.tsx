"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DIAGNOSTICO_CONTENT } from "@/lib/diagnostico/content";
import {
  DATOS_FIELD_MESSAGES,
  datosSchema,
  digitsOnly,
  type DatosFieldName,
  type DatosValues,
} from "@/lib/diagnostico/schema";
import { formatSlotLabel, getTimeZoneLabel, type Slot } from "@/lib/diagnostico/slots";
import type { LeadUtm } from "@/types/lead";

const { datosForm } = DIAGNOSTICO_CONTENT;

const GENERIC_ERROR = "No pudimos registrar tus datos. Intenta de nuevo en un momento.";

const inputClass =
  "min-h-[52px] rounded-xl border-[1.5px] border-input px-4 text-base md:text-base";

const labelClass = "text-sm font-semibold";

interface DatosStepProps {
  slot: Slot;
  timeZone: string;
  defaultValues: DatosValues;
  answers: Record<string, string[]>;
  utm: LeadUtm;
  onValuesChange: (values: DatosValues) => void;
  onChangeSlot: () => void;
  onSuccess: (result: { leadId: string; confirmationCode: string }) => void;
  onNotQualified: () => void;
}

export default function DatosStep({
  slot,
  timeZone,
  defaultValues,
  answers,
  utm,
  onValuesChange,
  onChangeSlot,
  onSuccess,
  onNotQualified,
}: DatosStepProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<DatosValues>({
    resolver: zodResolver(datosSchema),
    defaultValues,
  });

  // Conserva lo escrito al ir a la agenda ("Cambiar") o volver desde la confirmación.
  useEffect(() => {
    const subscription = form.watch((values) => onValuesChange(values as DatosValues));
    return () => subscription.unsubscribe();
  }, [form, onValuesChange]);

  const consentGiven = form.watch("consentConfirmacion");
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: DatosValues) => {
    setSubmitError(null);

    // TODO Fase 3: reservar el horario en Cal.com al enviar.
    let response: Response;
    try {
      response = await fetch("/api/diagnostico/lead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: values.nombre,
          whatsappCountryCode: values.whatsappCountryCode,
          whatsappNumber: digitsOnly(values.whatsappNumber),
          email: values.email,
          clinica: values.clinica,
          ciudad: values.ciudad,
          answers,
          consentConfirmacion: values.consentConfirmacion,
          consentMarketing: values.consentMarketing,
          utm,
          website: values.website,
        }),
      });
    } catch (error) {
      console.error("Error sending diagnostico lead:", error);
      setSubmitError(GENERIC_ERROR);
      return;
    }

    const data = await response.json().catch(() => null);

    if (response.status === 201 && data?.leadId && data?.confirmationCode) {
      onSuccess({ leadId: data.leadId, confirmationCode: data.confirmationCode });
      return;
    }

    if (response.status === 400 && data?.error === "not_qualified") {
      onNotQualified();
      return;
    }

    if (response.status === 400 && data?.error === "invalid" && data.fields) {
      const fieldNames = Object.keys(data.fields).filter(
        (key): key is DatosFieldName => key in DATOS_FIELD_MESSAGES
      );

      fieldNames.forEach((name, i) =>
        form.setError(
          name,
          { type: "server", message: DATOS_FIELD_MESSAGES[name] },
          { shouldFocus: i === 0 }
        )
      );

      if (fieldNames.length > 0) return;
    }

    setSubmitError(GENERIC_ERROR);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3 rounded-[14px] bg-secondary px-[18px] py-4">
        <div className="flex flex-col gap-0.5">
          <strong className="text-[15px] text-secondary-foreground">{formatSlotLabel(slot, timeZone)}</strong>
          <span className="text-[13px] text-secondary-foreground">
            Llamada diagnóstico · 15 min · {getTimeZoneLabel(timeZone)}
          </span>
        </div>
        <button
          type="button"
          onClick={onChangeSlot}
          className="min-h-11 shrink-0 rounded-lg px-3.5 text-sm font-bold text-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Cambiar
        </button>
      </div>

      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-[18px]">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 space-y-0">
                  <FormLabel className={labelClass}>Nombre completo *</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="name"
                      placeholder={datosForm.nombrePlaceholder}
                      className={inputClass}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 space-y-0">
                  <FormLabel className={labelClass}>WhatsApp *</FormLabel>
                  <div className="flex gap-2">
                    <select
                      aria-label="País del número de WhatsApp"
                      {...form.register("whatsappCountryCode")}
                      className="min-h-[52px] rounded-xl border-[1.5px] border-input bg-white px-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="+52">MX +52</option>
                      <option value="+1">US +1</option>
                    </select>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder="55 1234 5678"
                        className={`${inputClass} min-w-0 flex-grow`}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <p className="text-[13px] text-muted-foreground">
                    Aquí te llegará el mensaje para confirmar tu cita. Verifica que sea correcto.
                  </p>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 space-y-0">
                  <FormLabel className={labelClass}>Correo *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="tu@correo.com"
                      className={inputClass}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[18px]">
              <FormField
                control={form.control}
                name="clinica"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 space-y-0">
                    <FormLabel className={labelClass}>Nombre de la clínica *</FormLabel>
                    <FormControl>
                      <Input autoComplete="organization" className={inputClass} {...field} />
                    </FormControl>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ciudad"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 space-y-0">
                    <FormLabel className={labelClass}>Ciudad y estado *</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="address-level2"
                        placeholder={datosForm.ciudadPlaceholder}
                        className={inputClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />
            </div>

            {/* Campo trampa: invisible para personas, los bots lo llenan */}
            <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
              <label htmlFor="diagnostico-website">Sitio web</label>
              <input
                id="diagnostico-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...form.register("website")}
              />
            </div>

            <div className="flex flex-col gap-3.5 pt-1">
              <FormField
                control={form.control}
                name="consentConfirmacion"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <div className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked === true)}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          className="mt-0.5 h-5 w-5 rounded"
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer text-sm font-normal leading-[1.55] text-foreground">
                        <strong>{datosForm.consentConfirmacion.label}</strong>{" "}
                        {datosForm.consentConfirmacion.text}
                      </FormLabel>
                    </div>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consentMarketing"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        className="mt-0.5 h-5 w-5 rounded"
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer text-sm font-normal leading-[1.55] text-foreground">
                      <strong>{datosForm.consentMarketing.label}</strong>{" "}
                      {datosForm.consentMarketing.text}
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {submitError && (
            <p role="alert" className="text-center text-sm font-medium text-red-700">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={!consentGiven || isSubmitting}
            className="flex min-h-[58px] items-center justify-center gap-2 rounded-full bg-primary text-lg font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-border disabled:text-muted-foreground"
          >
            {isSubmitting && <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />}
            {isSubmitting ? "Agendando…" : "Agendar mi llamada"}
          </button>

          <p className="text-center text-[13px] text-muted-foreground">
            Al agendar aceptas nuestro{" "}
            <Link
              href={DIAGNOSTICO_CONTENT.privacyUrl}
              target="_blank"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              Aviso de Privacidad
            </Link>
            .
          </p>
        </form>
      </Form>
    </>
  );
}
