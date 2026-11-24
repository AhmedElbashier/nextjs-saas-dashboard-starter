/**
 * SAMPLE DATA ONLY.
 * Everything in this file is generated from a fixed seed so screenshots and tests are
 * reproducible. None of it represents real customers, revenue or usage.
 * Replace `getDashboardData()` with your API / database calls.
 */

export type Plan = "Starter" | "Pro" | "Enterprise";
export type CustomerStatus = "active" | "trialing" | "past_due" | "canceled";

export interface Customer {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  status: CustomerStatus;
  mrr: number; // monthly recurring revenue in USD
  seats: number;
  createdAt: string; // ISO date
}

export interface MonthlyPoint {
  month: string; // "Jan".."Dec"
  revenue: number;
  newCustomers: number;
}

export interface Kpi {
  label: string;
  value: number;
  format: "currency" | "number" | "percent";
  change: number; // % vs previous period
}

/** Small deterministic PRNG (mulberry32) so the sample data never changes between runs. */
export function createRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ["Ava", "Omar", "Lina", "Noah", "Sara", "Yusuf", "Mia", "Adam", "Huda", "Leo", "Zara", "Karim", "Nora", "Ali", "Emma", "Rami"];
const COMPANY = ["Northwind", "Acme", "Globex", "Initech", "Umbrella", "Stark", "Wayne", "Hooli", "Vandelay", "Soylent", "Tyrell", "Cyberdyne"];
const PLANS: Plan[] = ["Starter", "Pro", "Enterprise"];
const PLAN_PRICE: Record<Plan, number> = { Starter: 29, Pro: 99, Enterprise: 499 };
const STATUSES: CustomerStatus[] = ["active", "active", "active", "trialing", "past_due", "canceled"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function generateCustomers(count = 48, seed = 42): Customer[] {
  const rnd = createRng(seed);
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(rnd() * xs.length)];
  return Array.from({ length: count }, (_, i) => {
    const first = pick(FIRST);
    const company = pick(COMPANY);
    const plan = pick(PLANS);
    const status = pick(STATUSES);
    const seats = plan === "Enterprise" ? 10 + Math.floor(rnd() * 90) : 1 + Math.floor(rnd() * 9);
    const mrr = status === "canceled" || status === "trialing" ? 0 : PLAN_PRICE[plan] * (plan === "Starter" ? 1 : seats);
    const day = 1 + Math.floor(rnd() * 330);
    const created = new Date(Date.UTC(2025, 0, 1) + day * 86_400_000);
    return {
      id: `cus_${(i + 1).toString().padStart(4, "0")}`,
      name: `${first} @ ${company}`,
      email: `${first.toLowerCase()}@${company.toLowerCase()}.example`,
      plan,
      status,
      mrr,
      seats,
      createdAt: created.toISOString().slice(0, 10),
    };
  });
}

/**
 * 12 months of revenue that ends at `endRevenue` (so the chart agrees with the MRR KPI),
 * walking backwards with 3-11% month-over-month growth.
 */
export function generateMonthlySeries(endRevenue = 100_000, seed = 7): MonthlyPoint[] {
  const rnd = createRng(seed);
  const points: MonthlyPoint[] = [];
  let revenue = endRevenue;
  for (let i = MONTHS.length - 1; i >= 0; i--) {
    points.unshift({ month: MONTHS[i], revenue: Math.round(revenue), newCustomers: 2 + Math.floor(rnd() * 8) });
    revenue = revenue / (1.03 + rnd() * 0.08);
  }
  return points;
}

export function currentMrr(customers: Customer[]) {
  return customers.filter((c) => c.status === "active" || c.status === "past_due").reduce((s, c) => s + c.mrr, 0);
}

export function computeKpis(customers: Customer[], series: MonthlyPoint[]): Kpi[] {
  const paying = customers.filter((c) => c.status === "active" || c.status === "past_due");
  const churned = customers.filter((c) => c.status === "canceled").length;
  const last = series.at(-1)!;
  const prev = series.at(-2)!;
  const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round(((a - b) / b) * 1000) / 10);
  return [
    { label: "MRR", value: currentMrr(customers), format: "currency", change: pct(last.revenue, prev.revenue) },
    { label: "Paying customers", value: paying.length, format: "number", change: 0 },
    { label: "New customers this month", value: last.newCustomers, format: "number", change: pct(last.newCustomers, prev.newCustomers) },
    { label: "Churn rate", value: customers.length ? Math.round((churned / customers.length) * 1000) / 10 : 0, format: "percent", change: 0 },
  ];
}

export function revenueByPlan(customers: Customer[]) {
  return PLANS.map((plan) => ({
    plan,
    mrr: customers.filter((c) => c.plan === plan && c.status !== "canceled").reduce((s, c) => s + c.mrr, 0),
  }));
}

export function getDashboardData() {
  const customers = generateCustomers();
  const series = generateMonthlySeries(currentMrr(customers));
  return { customers, series, kpis: computeKpis(customers, series), byPlan: revenueByPlan(customers) };
}
