"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { MonthlyPoint } from "@/lib/sample-data";

const revenueConfig = { revenue: { label: "Revenue", color: "var(--chart-1)" } } satisfies ChartConfig;
const planConfig = { mrr: { label: "MRR", color: "var(--chart-2)" } } satisfies ChartConfig;

export function RevenueChart({ data }: { data: MonthlyPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Monthly revenue, last 12 months (sample data)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueConfig} className="h-64 w-full">
          <AreaChart data={data} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area dataKey="revenue" type="monotone" fill="var(--color-revenue)" fillOpacity={0.2} stroke="var(--color-revenue)" strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function PlanChart({ data }: { data: { plan: string; mrr: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>MRR by plan</CardTitle>
        <CardDescription>Current month (sample data)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={planConfig} className="h-64 w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="plan" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="mrr" fill="var(--color-mrr)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
