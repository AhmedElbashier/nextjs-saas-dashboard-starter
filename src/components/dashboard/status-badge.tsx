import { Badge } from "@/components/ui/badge";
import type { CustomerStatus } from "@/lib/sample-data";

const LABEL: Record<CustomerStatus, string> = {
  active: "Active",
  trialing: "Trialing",
  past_due: "Past due",
  canceled: "Canceled",
};

const VARIANT: Record<CustomerStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  trialing: "secondary",
  past_due: "destructive",
  canceled: "outline",
};

export function StatusBadge({ status }: { status: CustomerStatus }) {
  return <Badge variant={VARIANT[status]}>{LABEL[status]}</Badge>;
}
