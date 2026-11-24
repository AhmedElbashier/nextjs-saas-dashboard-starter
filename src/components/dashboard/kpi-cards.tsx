import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Kpi } from "@/lib/sample-data";
import { formatValue } from "@/lib/table";

export function KpiCards({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k) => (
        <Card key={k.label}>
          <CardHeader>
            <CardDescription>{k.label}</CardDescription>
            <CardTitle className="text-2xl tabular-nums">{formatValue(k.value, k.format)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {k.change === 0 ? (
              <span>No change vs last month</span>
            ) : (
              <span className={k.change > 0 ? "inline-flex items-center gap-1 text-emerald-600" : "inline-flex items-center gap-1 text-red-600"}>
                {k.change > 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {Math.abs(k.change)}% vs last month
              </span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
