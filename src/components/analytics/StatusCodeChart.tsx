"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { type StatusCodeDistribution } from "@/types/analytics";
import { AnalyticsEmptyState } from "./AnalyticsEmptyState";
import { AnalyticsErrorState } from "./AnalyticsErrorState";
import { formatNumber } from "@/lib/analytics/formatters";

const COLORS = ["#22c55e", "#6366f1", "#f59e0b", "#ef4444", "#64748b", "#94a3b8"];

interface Props {
  data: StatusCodeDistribution | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function StatusCodeChart({ data, loading, error, onRetry }: Props) {
  if (loading) {
    return <div className="h-72 rounded-lg bg-secondary border border-border animate-pulse" />;
  }
  if (error) {
    return <AnalyticsErrorState message={error} onRetry={onRetry} />;
  }
  if (!data || !data.items.length || data.total === 0) {
    return <AnalyticsEmptyState message="No status-code data for the selected range." />;
  }

  const chartData = data.items.map((i) => ({
    name: i.label,
    value: i.count,
    percentage: i.percentage ?? (data.total > 0 ? (i.count / data.total) * 100 : 0),
  }));

  return (
    <div className="bg-secondary border border-border rounded-lg p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-primary">HTTP Status Distribution</h3>
        <p className="text-xs text-secondary">Responses grouped by status category</p>
      </div>
      <div className="h-72 flex items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "rgb(var(--bg-secondary))", border: "1px solid rgb(var(--border))", borderRadius: 8, color: "rgb(var(--text-primary))", fontSize: 12 }}
              formatter={(value: unknown, _name: unknown, props: unknown) => [
                `${formatNumber(value as number)} (${(((props as { payload?: { percentage?: number } })?.payload?.percentage) ?? 0).toFixed(1)}%)`,
                "Count",
              ] as [string, string]}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 12, color: "rgb(var(--text-secondary))" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
