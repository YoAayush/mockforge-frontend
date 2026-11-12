"use client";

import { Activity, AlertCircle, CheckCircle2, Gauge, type LucideIcon } from "lucide-react";
import { type AnalyticsOverview } from "@/types/analytics";
import { formatNumber, formatPercent } from "@/lib/analytics/formatters";
import { QuotaProgress } from "./QuotaProgress";

function Card({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="bg-secondary border border-border rounded-lg p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-secondary">{title}</h3>
        <Icon className="w-4 h-4 text-secondary" />
      </div>
      {children}
    </div>
  );
}

export function UsageOverviewCards({ overview }: { overview: AnalyticsOverview | null }) {
  if (!overview) return null;
  const q = overview.quota;
  const used = q.used;
  const limit = q.limit;
  const remaining = q.remaining ?? Math.max(0, limit - used);
  const pct = q.percentage ?? (limit > 0 ? (used / limit) * 100 : 0);
  const compare =
    overview.previousTotalRequests !== undefined
      ? overview.totalRequests - overview.previousTotalRequests
      : undefined;
  const comparePct =
    overview.previousTotalRequests && overview.previousTotalRequests > 0
      ? ((overview.totalRequests - overview.previousTotalRequests) / overview.previousTotalRequests) * 100
      : undefined;

  const exhausted = limit > 0 && remaining <= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* <Card title="Total Requests" icon={Activity}>
        <p className="text-2xl font-bold text-primary">{formatNumber(overview.totalRequests)}</p>
        <p className="text-xs text-secondary">
          {compare !== undefined
            ? `${compare >= 0 ? "+" : ""}${formatNumber(compare)} vs previous period${comparePct !== undefined ? ` (${comparePct >= 0 ? "+" : ""}${comparePct.toFixed(1)}%)` : ""}`
            : "Previous period data unavailable"}
        </p>
      </Card> */}

      <Card title="Free-Tier Quota" icon={Gauge}>
        <p className="text-2xl font-bold text-primary">
          {formatNumber(used)} <span className="text-base font-normal text-secondary">/ {formatNumber(limit)}</span>
        </p>
        <QuotaProgress used={used} limit={limit} />
        <p className="text-xs text-secondary">{pct.toFixed(1)}% of quota consumed</p>
      </Card>

      <Card title="Remaining Requests" icon={CheckCircle2}>
        <p className={`text-2xl font-bold ${exhausted ? "text-red-400" : "text-primary"}`}>
          {formatNumber(remaining)}
        </p>
        <p className="text-xs text-secondary">
          {exhausted ? "Quota exhausted" : `${formatNumber(limit - used)} requests left`}
        </p>
      </Card>

      <Card title="Success Rate" icon={AlertCircle}>
        <p className="text-2xl font-bold text-primary">{formatPercent(overview.successRate)}</p>
        <p className="text-xs text-secondary">
          {overview.successfulRequests !== undefined
            ? `${formatNumber(overview.successfulRequests)} successful requests`
            : "Request count unavailable"}
        </p>
      </Card>
    </div>
  );
}
