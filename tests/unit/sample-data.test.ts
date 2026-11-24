import { describe, expect, it } from "vitest";
import { computeKpis, currentMrr, generateCustomers, generateMonthlySeries, getDashboardData, revenueByPlan } from "@/lib/sample-data";

describe("sample data", () => {
  it("is deterministic for a given seed", () => {
    expect(generateCustomers(10, 1)).toEqual(generateCustomers(10, 1));
    expect(generateCustomers(10, 1)).not.toEqual(generateCustomers(10, 2));
  });

  it("gives non-paying customers zero MRR", () => {
    for (const c of generateCustomers(200, 3)) {
      if (c.status === "canceled" || c.status === "trialing") expect(c.mrr).toBe(0);
      else expect(c.mrr).toBeGreaterThan(0);
    }
  });

  it("produces 12 monthly points", () => {
    expect(generateMonthlySeries()).toHaveLength(12);
  });

  it("computes KPIs consistent with the rows", () => {
    const customers = generateCustomers();
    const kpis = computeKpis(customers, generateMonthlySeries(currentMrr(customers)));
    const mrr = kpis.find((k) => k.label === "MRR")!.value;
    const byPlanTotal = revenueByPlan(customers).reduce((s, p) => s + p.mrr, 0);
    expect(mrr).toBe(byPlanTotal);
  });

  it("ends the revenue series at the current MRR", () => {
    const d = getDashboardData();
    expect(d.series.at(-1)!.revenue).toBe(d.kpis[0].value);
    const revs = d.series.map((p) => p.revenue);
    expect(revs).toEqual([...revs].sort((a, b) => a - b));
  });

  it("bundles everything the dashboard needs", () => {
    const d = getDashboardData();
    expect(d.customers.length).toBe(48);
    expect(d.kpis).toHaveLength(4);
    expect(d.byPlan).toHaveLength(3);
  });
});
