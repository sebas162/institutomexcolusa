import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/types/lead";
import { STATUS_META } from "./lead-utils";

export default function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <Badge className={cn("border-transparent font-semibold shadow-none hover:bg-inherit", meta.className)}>
      {meta.label}
    </Badge>
  );
}
