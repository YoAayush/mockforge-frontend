"use client";

import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { type EndpointAnalytics } from "@/types/analytics";
import { AnalyticsEmptyState } from "./AnalyticsEmptyState";
import { AnalyticsErrorState } from "./AnalyticsErrorState";
import { formatNumber } from "@/lib/analytics/formatters";

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-400",
  POST: "bg-indigo-500/15 text-indigo-400",
  PUT: "bg-amber-500/15 text-amber-400",
  PATCH: "bg-amber-500/15 text-amber-400",
  DELETE: "bg-red-500/15 text-red-400",
};

interface Props {
  data: EndpointAnalytics | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  sortOrder: "asc" | "desc";
  onSortChange: () => void;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function EndpointAnalyticsTable({
  data,
  loading,
  error,
  onRetry,
  sortOrder,
  onSortChange,
  page,
  pageSize,
  onPageChange,
}: Props) {
  if (loading) {
    return <div className="h-64 rounded-lg bg-secondary border border-border animate-pulse" />;
  }
  if (error) {
    return <AnalyticsErrorState message={error} onRetry={onRetry} />;
  }
  if (!data || !data.items.length) {
    return <AnalyticsEmptyState message="No endpoint data for the selected range." />;
  }

  const totalPages = Math.max(1, Math.ceil(data.total / (data.pageSize || pageSize)));


  return (
    <div className="bg-secondary border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-primary">Endpoint Analytics</h3>
        <p className="text-xs text-secondary">
          Ranked by request count. Per-endpoint latency and error details are not exposed by the current API.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-tertiary/50">
            <tr>
              <th className="text-left px-4 py-2 text-xs font-medium text-secondary">Method</th>
              <th className="text-left px-4 py-2 text-xs font-medium text-secondary">Endpoint</th>
              <th className="text-right px-4 py-2 text-xs font-medium text-secondary">
                <button onClick={onSortChange} className="inline-flex items-center gap-1 text-xs font-medium text-secondary hover:text-primary">
                  Total
                  <ArrowUpDown className="w-3 h-3 text-primary" />
                  <span className="text-[10px]">{sortOrder === "asc" ? "↑" : "↓"}</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((row, idx) => (
              <tr key={`${row.method}-${row.path}-${idx}`} className="border-t border-border hover:bg-tertiary/30">
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${METHOD_COLORS[row.method] ?? "bg-slate-500/15 text-slate-400"}`}>
                    {row.method}
                  </span>
                </td>
                <td className="px-4 py-2 font-mono text-xs text-primary max-w-[420px] truncate" title={row.path}>
                  {row.path}
                </td>
                <td className="px-4 py-2 text-right text-primary">{formatNumber(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <p className="text-xs text-secondary">
          Page {data.page} of {totalPages} · {formatNumber(data.total)} endpoints
        </p>
        <div className="flex gap-1">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="p-1.5 rounded border border-border text-secondary disabled:opacity-40 hover:bg-tertiary"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="p-1.5 rounded border border-border text-secondary disabled:opacity-40 hover:bg-tertiary"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
