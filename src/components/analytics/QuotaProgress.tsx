"use client";

import { formatNumber, quotaVariant } from "@/lib/analytics/formatters";

export function QuotaProgress({ used, limit }: { used: number; limit: number }) {
  const percentage = limit > 0 ? (used / limit) * 100 : 0;
  const variant = quotaVariant(percentage);
  const barColor =
    variant === "danger" ? "bg-red-500" : variant === "warning" ? "bg-yellow-500" : "bg-indigo-500";

  return (
    <div className="w-full">
      <div className="w-full bg-tertiary rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs text-secondary">
        <span>{formatNumber(used)} used</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}
