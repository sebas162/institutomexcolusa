"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Ventana de confirmación para usar dentro de la ficha del lead. Va sobre Dialog y no sobre
 * AlertDialog: AlertDialog trae otra copia de Radix y la ficha no la reconoce como capa encima,
 * así que un clic adentro cerraba la ficha y la ficha le quitaba el foco a los campos.
 */
export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel,
  confirmClassName,
  confirmDisabled = false,
  busy,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
  confirmLabel: string;
  confirmClassName?: string;
  confirmDisabled?: boolean;
  busy: boolean;
  onConfirm: () => void;
}) {
  const close = (value: boolean) => {
    if (!busy) onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      {/* Como una alerta: no se cierra con un clic fuera, solo con Volver, la X o Escape. */}
      <DialogContent role="alertdialog" onInteractOutside={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" disabled={busy} onClick={() => close(false)}>
            Volver
          </Button>
          <Button disabled={busy || confirmDisabled} className={confirmClassName} onClick={onConfirm}>
            {busy && <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
