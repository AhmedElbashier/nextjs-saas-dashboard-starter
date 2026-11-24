import Link from "next/link";
import { PlanChart, RevenueChart } from "@/components/dashboard/charts";
import { CustomersTable } from "@/components/dashboard/customers-table";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/sample-data";

export const metadata = { title: "Overview" };

export default function OverviewPage() {
  const { kpis, series, byPlan, customers } = getDashboardData();
  const recent = [...customers].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">All figures below are generated sample data for demonstration.</p>
      </div>
      <KpiCards kpis={kpis} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={series} />
        </div>
        <PlanChart data={byPlan} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Newest customers</CardTitle>
          <CardDescription>Latest sign-ups (sample data)</CardDescription>
          <CardAction>
            <Link href="/dashboard/customers" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <CustomersTable data={recent} pageSize={5} compact />
        </CardContent>
      </Card>
    </>
  );
}
