import type { Customer, CustomerStatus } from "./sample-data";

export type SortKey = "name" | "plan" | "status" | "mrr" | "seats" | "createdAt";
export type SortDir = "asc" | "desc";

export interface TableQuery {
  search: string;
  status: CustomerStatus | "all";
  sortKey: SortKey;
  sortDir: SortDir;
  page: number; // 1-based
  pageSize: number;
}

export const DEFAULT_QUERY: TableQuery = {
  search: "",
  status: "all",
  sortKey: "createdAt",
  sortDir: "desc",
  page: 1,
  pageSize: 10,
};

/** Pure filter -> sort -> paginate pipeline. Easy to move server-side later. */
export function queryCustomers(rows: Customer[], q: TableQuery) {
  const term = q.search.trim().toLowerCase();
  const filtered = rows.filter(
    (r) =>
      (q.status === "all" || r.status === q.status) &&
      (!term || r.name.toLowerCase().includes(term) || r.email.toLowerCase().includes(term) || r.id.includes(term)),
  );

  const dir = q.sortDir === "asc" ? 1 : -1;
  const sorted = [...filtered].sort((a, b) => {
    const av = a[q.sortKey];
    const bv = b[q.sortKey];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / q.pageSize));
  const page = Math.min(Math.max(1, q.page), pageCount);
  const start = (page - 1) * q.pageSize;
  return { rows: sorted.slice(start, start + q.pageSize), total, page, pageCount };
}

export function toggleSort(q: TableQuery, key: SortKey): TableQuery {
  if (q.sortKey === key) return { ...q, sortDir: q.sortDir === "asc" ? "desc" : "asc", page: 1 };
  return { ...q, sortKey: key, sortDir: "asc", page: 1 };
}

export function formatValue(value: number, format: "currency" | "number" | "percent") {
  if (format === "currency")
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  if (format === "percent") return `${value}%`;
  return new Intl.NumberFormat("en-US").format(value);
}
