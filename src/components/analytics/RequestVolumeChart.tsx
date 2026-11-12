"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { type AnalyticsUsage } from "@/types/analytics";
import { AnalyticsEmptyState } from "./AnalyticsEmptyState";
import { AnalyticsErrorState } from "./AnalyticsErrorState";
import { formatNumber, formatShortDate } from "@/lib/analytics/formatters";

interface Props {
  usage: AnalyticsUsage | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function RequestVolumeChart({ usage, loading, error, onRetry }: Props) {
  const data = useMemo(() => {
    if (!usage) return [];
    return usage.points.map((p) => ({
      timestamp: p.timestamp,
      requests: p.count,
      previous: p.previousCount,
    }));
  }, [usage]);

  const hasPrevious = data.some((d) => d.previous !== undefined);

  if (loading) {
    return <div className="h-72 rounded-lg bg-secondary border border-border animate-pulse" />;
  }
  if (error) {
    return <AnalyticsErrorState message={error} onRetry={onRetry} />;
  }
  if (!data.length || data.every((d) => d.requests === 0)) {
    return <AnalyticsEmptyState message="No request volume data for the selected range." />;
  }

  return (
    <div className="bg-secondary border border-border rounded-lg p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-primary">API Request Volume</h3>
        <p className="text-xs text-secondary">Requests over time ({usage?.interval === "hour" ? "hourly" : "daily"})</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(v: unknown) => (usage?.interval === "hour" ? new Date(v as string).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : formatShortDate(v as string))}
              stroke="rgb(var(--text-secondary))"
              fontSize={11}
              minTickGap={24}
            />
            <YAxis
              tickFormatter={(v) => formatNumber(v)}
              stroke="rgb(var(--text-secondary))"
              fontSize={11}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "rgb(var(--bg-secondary))", border: "1px solid rgb(var(--border))", borderRadius: 8, color: "rgb(var(--text-primary))", fontSize: 12 }}
              labelFormatter={(v: unknown) => new Date(v as string).toLocaleString()}
              formatter={(value: unknown, name: unknown) => [formatNumber(value as number), name === "requests" ? "Requests" : "Previous period"] as [string, string]}
            />
            {hasPrevious && <Legend />}
            <Line type="monotone" dataKey="requests" name="Requests" stroke="rgb(var(--accent))" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            {hasPrevious && (
              <Line type="monotone" dataKey="previous" name="Previous" stroke="rgb(var(--text-tertiary))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
