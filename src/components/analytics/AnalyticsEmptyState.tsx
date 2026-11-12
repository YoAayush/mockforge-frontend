"use client";

import { BarChart3 } from "lucide-react";

export function AnalyticsEmptyState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-secondary p-12 text-center">
      <BarChart3 className="w-8 h-8 text-secondary" />
      <h3 className="text-base font-semibold text-primary">No usage data yet</h3>
      <p className="text-sm text-secondary max-w-md">
        {message || "API requests will appear here once your mock endpoints start receiving traffic."}
      </p>
    </div>
  );
}
