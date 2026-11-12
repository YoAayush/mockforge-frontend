"use client";

import { Clock, XCircle, AlertOctagon } from "lucide-react";
import { type AnalyticsOverview } from "@/types/analytics";
import { formatMs, formatNumber, formatPercent } from "@/lib/analytics/formatters";

export function SecondaryMetrics({ overview }: { overview: AnalyticsOverview | null }) {
  if (!overview) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-secondary border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1"><Clock className="w-4 h-4 text-secondary" /><span className="text-xs text-secondary">Avg Response Time</span></div>
        <p className="text-lg font-semibold text-primary">{formatMs(overview.avgResponseTimeMs)}</p>
      </div>
      {/* <div className="bg-secondary border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1"><Clock className="w-4 h-4 text-secondary" /><span className="text-xs text-secondary">p95 Response Time</span></div>
        <p className="text-lg font-semibold text-primary">
          {overview.p95ResponseTimeMs !== undefined ? formatMs(overview.p95ResponseTimeMs) : "Unavailable"}
        </p>
      </div> */}
      <div className="bg-secondary border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1"><XCircle className="w-4 h-4 text-secondary" /><span className="text-xs text-secondary">Total Failed</span></div>
        <p className="text-lg font-semibold text-primary">{overview.failedRequests !== undefined ? formatNumber(overview.failedRequests) : "Unavailable"}</p>
      </div>
      <div className="bg-secondary border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1"><AlertOctagon className="w-4 h-4 text-secondary" /><span className="text-xs text-secondary">Error Rate</span></div>
        <p className="text-lg font-semibold text-primary">{overview.errorRate !== undefined ? formatPercent(overview.errorRate) : "Unavailable"}</p>
      </div>
    </div>
  );
}
