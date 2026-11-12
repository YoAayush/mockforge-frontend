"use client";

import { type AnalyticsOverview, type UsageForecast } from "@/types/analytics";
import { AnalyticsErrorState } from "./AnalyticsErrorState";
import { formatNumber } from "@/lib/analytics/formatters";

interface Props {
  overview: AnalyticsOverview | null;
  forecast: UsageForecast | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function UsageInsights({ overview, forecast, loading, error, onRetry }: Props) {
  if (loading) {
    return <div className="h-36 rounded-lg bg-secondary border border-border animate-pulse" />;
  }
  if (error) {
    return <AnalyticsErrorState message={error} onRetry={onRetry} />;
  }

  const q = overview?.quota;
  const used = q?.used ?? 0;
  const limit = q?.limit ?? 0;
  const pct = q?.percentage ?? (limit > 0 ? (used / limit) * 100 : 0);

  const avgDaily = forecast?.averageDailyRequests;
  const exhaustion = forecast?.estimatedExhaustionDate;
  const comparePct = forecast?.usageComparedToPreviousPercent ?? (overview?.previousTotalRequests
    ? ((overview.totalRequests - overview.previousTotalRequests) / overview.previousTotalRequests) * 100
    : undefined);

  const thresholds = forecast?.thresholdWarnings ?? [
    { threshold: 80, reached: pct >= 80 },
    { threshold: 90, reached: pct >= 90 },
    { threshold: 100, reached: pct >= 100 },
  ];

  return (
    <div className="bg-secondary border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-primary mb-3">Quota Usage Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 rounded bg-tertiary/40 border border-border">
          <p className="text-xs text-secondary mb-1">Current consumption</p>
          <p className="text-base font-semibold text-primary">{pct.toFixed(1)}%</p>
          <p className="text-xs text-secondary">{used.toLocaleString()} of {limit.toLocaleString()} requests</p>
        </div>
        <div className="p-3 rounded bg-tertiary/40 border border-border">
          <p className="text-xs text-secondary mb-1">Compared to previous period</p>
          <p className="text-base font-semibold text-primary">
            {comparePct !== undefined ? `${comparePct >= 0 ? "+" : ""}${comparePct.toFixed(1)}%` : "Unavailable"}
          </p>
        </div>
        <div className="p-3 rounded bg-tertiary/40 border border-border">
          <p className="text-xs text-secondary mb-1">Average daily volume</p>
          <p className="text-base font-semibold text-primary">
            {avgDaily !== undefined ? `${formatNumber(avgDaily)} req/day` : "Not enough data"}
          </p>
        </div>
        <div className="p-3 rounded bg-tertiary/40 border border-border">
          <p className="text-xs text-secondary mb-1">Estimated quota exhaustion</p>
          <p className="text-base font-semibold text-primary">
            {forecast && forecast.enoughData && exhaustion
              ? new Date(exhaustion).toLocaleDateString()
              : "Not enough data to estimate usage"}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {thresholds.map((t) => (
          <span
            key={t.threshold}
            className={`text-xs px-2 py-1 rounded border ${
              t.reached
                ? "border-red-500/40 text-red-400 bg-red-500/10"
                : "border-border text-secondary bg-tertiary/40"
            }`}
          >
            {t.threshold}% {t.reached ? "reached" : "not reached"}
          </span>
        ))}
      </div>
      {forecast?.message && <p className="mt-2 text-xs text-secondary">{forecast.message}</p>}
    </div>
  );
}
