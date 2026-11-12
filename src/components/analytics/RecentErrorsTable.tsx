"use client";

import { AlertTriangle, ServerCrash } from "lucide-react";
import { type ApiErrorsResponse } from "@/types/analytics";
import { AnalyticsEmptyState } from "./AnalyticsEmptyState";
import { AnalyticsErrorState } from "./AnalyticsErrorState";
import { formatMs } from "@/lib/analytics/formatters";

interface Props {
  data: ApiErrorsResponse | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function RecentErrorsTable({ data, loading, error, onRetry }: Props) {
  if (loading) {
    return <div className="h-48 rounded-lg bg-secondary border border-border animate-pulse" />;
  }
  if (error) {
    return <AnalyticsErrorState message={error} onRetry={onRetry} />;
  }
  if (!data || !data.items.length) {
    return <AnalyticsEmptyState message="No recent errors. Great job!" />;
  }

  return (
    <div className="bg-secondary border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-primary">Recent API Errors</h3>
        <p className="text-xs text-secondary">Most recent failed requests</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-tertiary/50">
            <tr>
              <th className="text-left px-4 py-2 text-xs font-medium text-secondary">Timestamp</th>
              <th className="text-left px-4 py-2 text-xs font-medium text-secondary">Method</th>
              <th className="text-left px-4 py-2 text-xs font-medium text-secondary">Endpoint</th>
              <th className="text-left px-4 py-2 text-xs font-medium text-secondary">Status</th>
              <th className="text-left px-4 py-2 text-xs font-medium text-secondary">Category / Message</th>
              <th className="text-right px-4 py-2 text-xs font-medium text-secondary">Response Time</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((row, idx) => {
              const is5xx = row.statusCode >= 500;
              const is4xx = row.statusCode >= 400 && row.statusCode < 500;
              return (
                <tr key={row.id ?? idx} className="border-t border-border">
                  <td className="px-4 py-2 text-xs text-secondary whitespace-nowrap">{new Date(row.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 text-xs font-medium text-primary">{row.method}</td>
                  <td className="px-4 py-2 font-mono text-xs text-primary max-w-[220px] truncate" title={row.path}>{row.path}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                      is5xx ? "bg-red-500/15 text-red-400" : is4xx ? "bg-amber-500/15 text-amber-400" : "bg-slate-500/15 text-slate-400"
                    }`}>
                      {is5xx ? <ServerCrash className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {row.statusCode}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-secondary max-w-[260px] truncate" title={row.message}>
                    {row.category ? `${row.category}${row.message ? `: ${row.message}` : ""}` : row.message ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-right text-secondary text-xs">{formatMs(row.responseTimeMs)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
