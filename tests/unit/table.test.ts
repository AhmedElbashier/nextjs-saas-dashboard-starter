import { describe, expect, it } from "vitest";
import { generateCustomers } from "@/lib/sample-data";
import { DEFAULT_QUERY, formatValue, queryCustomers, toggleSort } from "@/lib/table";

const rows = generateCustomers(48, 42);

describe("queryCustomers", () => {
  it("paginates", () => {
    const r = queryCustomers(rows, { ...DEFAULT_QUERY, pageSize: 10, page: 2 });
    expect(r.rows).toHaveLength(10);
    expect(r.pageCount).toBe(5);
    expect(r.page).toBe(2);
    expect(r.total).toBe(48);
  });

  it("clamps out-of-range pages", () => {
    expect(queryCustomers(rows, { ...DEFAULT_QUERY, page: 99 }).page).toBe(5);
    expect(queryCustomers(rows, { ...DEFAULT_QUERY, page: 0 }).page).toBe(1);
  });

  it("filters by status", () => {
    const r = queryCustomers(rows, { ...DEFAULT_QUERY, status: "trialing", pageSize: 100 });
    expect(r.rows.length).toBeGreaterThan(0);
    expect(r.rows.every((c) => c.status === "trialing")).toBe(true);
  });

  it("searches name, email and id case-insensitively", () => {
    const target = rows[3];
    const r = queryCustomers(rows, { ...DEFAULT_QUERY, search: target.email.toUpperCase(), pageSize: 100 });
    expect(r.rows.map((c) => c.id)).toContain(target.id);
    expect(queryCustomers(rows, { ...DEFAULT_QUERY, search: "cus_0001" }).rows[0].id).toBe("cus_0001");
  });

  it("returns an empty single page when nothing matches", () => {
    const r = queryCustomers(rows, { ...DEFAULT_QUERY, search: "zzz-no-match" });
    expect(r.rows).toEqual([]);
    expect(r.pageCount).toBe(1);
  });

  it("sorts numbers and strings in both directions", () => {
    const asc = queryCustomers(rows, { ...DEFAULT_QUERY, sortKey: "mrr", sortDir: "asc", pageSize: 100 }).rows;
    expect(asc.map((c) => c.mrr)).toEqual([...asc.map((c) => c.mrr)].sort((a, b) => a - b));
    const desc = queryCustomers(rows, { ...DEFAULT_QUERY, sortKey: "name", sortDir: "desc", pageSize: 100 }).rows;
    expect(desc[0].name.localeCompare(desc.at(-1)!.name)).toBeGreaterThanOrEqual(0);
  });
});

describe("toggleSort", () => {
  it("flips direction on the same column and resets to page 1", () => {
    const q = toggleSort({ ...DEFAULT_QUERY, sortKey: "mrr", sortDir: "asc", page: 3 }, "mrr");
    expect(q).toMatchObject({ sortKey: "mrr", sortDir: "desc", page: 1 });
  });
  it("starts ascending on a new column", () => {
    expect(toggleSort(DEFAULT_QUERY, "plan")).toMatchObject({ sortKey: "plan", sortDir: "asc" });
  });
});

describe("formatValue", () => {
  it("formats currency, numbers and percents", () => {
    expect(formatValue(12345, "currency")).toBe("$12,345");
    expect(formatValue(12345, "number")).toBe("12,345");
    expect(formatValue(4.2, "percent")).toBe("4.2%");
  });
});
