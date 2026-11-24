"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Customer, CustomerStatus } from "@/lib/sample-data";
import { DEFAULT_QUERY, formatValue, queryCustomers, toggleSort, type SortKey, type TableQuery } from "@/lib/table";
import { StatusBadge } from "./status-badge";

const COLUMNS: { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: "name", label: "Customer" },
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status" },
  { key: "seats", label: "Seats", numeric: true },
  { key: "mrr", label: "MRR", numeric: true },
  { key: "createdAt", label: "Created" },
];

export function CustomersTable({ data, pageSize = 10, compact = false }: { data: Customer[]; pageSize?: number; compact?: boolean }) {
  const [query, setQuery] = useState<TableQuery>({ ...DEFAULT_QUERY, pageSize });
  const result = useMemo(() => queryCustomers(data, query), [data, query]);

  return (
    <div className="space-y-3">
      {!compact && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Search name, email or id…"
            aria-label="Search customers"
            value={query.search}
            onChange={(e) => setQuery({ ...query, search: e.target.value, page: 1 })}
            className="sm:max-w-xs"
          />
          <select
            aria-label="Filter by status"
            value={query.status}
            onChange={(e) => setQuery({ ...query, status: e.target.value as CustomerStatus | "all", page: 1 })}
            className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="trialing">Trialing</option>
            <option value="past_due">Past due</option>
            <option value="canceled">Canceled</option>
          </select>
          <span className="text-sm text-muted-foreground sm:ml-auto" data-testid="row-count">
            {result.total} customers
          </span>
        </div>
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((c) => (
                <TableHead key={c.key} className={c.numeric ? "text-right" : undefined}>
                  <button
                    type="button"
                    onClick={() => setQuery(toggleSort(query, c.key))}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                    aria-label={`Sort by ${c.label}`}
                  >
                    {c.label}
                    <ArrowUpDown className="size-3 opacity-50" />
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} className="h-24 text-center text-muted-foreground">
                  No customers match your filters.
                </TableCell>
              </TableRow>
            ) : (
              result.rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                  </TableCell>
                  <TableCell>{r.plan}</TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{r.seats}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatValue(r.mrr, "currency")}</TableCell>
                  <TableCell className="tabular-nums">{r.createdAt}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!compact && (
        <div className="flex items-center justify-end gap-2 text-sm">
          <span className="text-muted-foreground">
            Page {result.page} of {result.pageCount}
          </span>
          <Button variant="outline" size="icon-sm" aria-label="Previous page" disabled={result.page <= 1} onClick={() => setQuery({ ...query, page: result.page - 1 })}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Next page" disabled={result.page >= result.pageCount} onClick={() => setQuery({ ...query, page: result.page + 1 })}>
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}
