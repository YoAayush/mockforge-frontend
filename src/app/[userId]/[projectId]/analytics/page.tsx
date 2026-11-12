"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProject } from "@/lib/projectProvider";
import { useUser } from "@/lib/userProvider";
import { DateRangeSelector } from "@/components/analytics/DateRangeSelector";
import { ProjectSelector } from "@/components/analytics/ProjectSelector";
import { AnalyticsLoadingState } from "@/components/analytics/AnalyticsLoadingState";
import { AnalyticsEmptyState } from "@/components/analytics/AnalyticsEmptyState";
import { AnalyticsErrorState } from "@/components/analytics/AnalyticsErrorState";
import { UsageOverviewCards } from "@/components/analytics/UsageOverviewCards";
import { SecondaryMetrics } from "@/components/analytics/SecondaryMetrics";
import { RequestVolumeChart } from "@/components/analytics/RequestVolumeChart";
import { EndpointAnalyticsTable } from "@/components/analytics/EndpointAnalyticsTable";
import { StatusCodeChart } from "@/components/analytics/StatusCodeChart";
import { UsageInsights } from "@/components/analytics/UsageInsights";
import {
  useOverview,
  useUsage,
  useEndpoints,
  useStatusCodes,
  useForecast,
} from "@/hooks/useAnalytics";
import type { DateRangeSelection, AnalyticsFilters } from "@/types/analytics";

function defaultRange(): DateRangeSelection {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 7);
  return { preset: "7d", from: from.toISOString(), to: to.toISOString() };
}

export default function AnalyticsPage() {
  const { projectData } = useProject();
  const { session } = useUser();
  const [dateRange, setDateRange] = useState<DateRangeSelection>(defaultRange);
  const interval = dateRange.preset === "24h" ? "hour" : "day";

  const projectId = projectData?.id ?? "";

  const filters: AnalyticsFilters = useMemo(
    () => ({ projectId, from: dateRange.from, to: dateRange.to, interval: interval as "hour" | "day" }),
    [projectId, dateRange.from, dateRange.to, interval],
  );

  const overview = useOverview(filters, session?.access_token);
  const usage = useUsage(filters, session?.access_token);
  const statusCodes = useStatusCodes(filters, session?.access_token);
  const forecast = useForecast(filters, session?.access_token, overview.data);

  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const endpoints = useEndpoints(filters, session?.access_token, page, pageSize, sortOrder);

  const handleSort = () => {
    setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const refreshAll = () => {
    overview.refetch();
    usage.refetch();
    statusCodes.refetch();
    endpoints.refetch();
    forecast.refetch();
  };

  const anyLoading =
    overview.loading ||
    usage.loading ||
    statusCodes.loading ||
    endpoints.loading ||
    forecast.loading;

  return (
    <div className="min-h-screen">
      <div className="border-b border-border px-8 py-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl text-primary font-bold mb-1">API Usage & Analytics</h1>
            <p className="text-secondary text-sm">Monitor API consumption, traffic trends, and endpoint performance.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ProjectSelector />
            <DateRangeSelector value={dateRange} onChange={(v) => { setDateRange(v); setPage(1); }} />
            <Button onClick={refreshAll} variant="outline" className="gap-2 border-border text-primary" disabled={anyLoading}>
              <RefreshCw className={`w-4 h-4 ${anyLoading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-secondary">
          <span>Range: {new Date(dateRange.from).toLocaleString()} – {new Date(dateRange.to).toLocaleString()}</span>
          <span className="opacity-50">•</span>
          <span>Billing period: {overview.data?.billingPeriodLabel ?? "Current billing period"}</span>
          {overview.data?.quota?.plan && (
            <>
              <span className="opacity-50">•</span>
              <span>Plan: {overview.data.quota.plan}</span>
            </>
          )}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {overview.loading && !overview.data ? (
          <AnalyticsLoadingState />
        ) : overview.error ? (
          <AnalyticsErrorState message={overview.error} onRetry={overview.refetch} />
        ) : !projectId ? (
          <AnalyticsEmptyState message="Select a project to view analytics." />
        ) : overview.data && overview.data.totalRequests === 0 && !overview.loading ? (
          <div className="space-y-4">
            <UsageOverviewCards overview={overview.data} />
            <SecondaryMetrics overview={overview.data} />
            <AnalyticsEmptyState />
          </div>
        ) : (
          <>
            <UsageOverviewCards overview={overview.data} />
            <SecondaryMetrics overview={overview.data} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RequestVolumeChart
                usage={usage.data}
                loading={usage.loading}
                error={usage.error}
                onRetry={usage.refetch}
              />
              <StatusCodeChart
                data={statusCodes.data}
                loading={statusCodes.loading}
                error={statusCodes.error}
                onRetry={statusCodes.refetch}
              />
            </div>

            <EndpointAnalyticsTable
              data={endpoints.data}
              loading={endpoints.loading}
              error={endpoints.error}
              onRetry={endpoints.refetch}
              sortOrder={sortOrder}
              onSortChange={handleSort}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
            />

            <UsageInsights
              overview={overview.data}
              forecast={forecast.data}
              loading={forecast.loading}
              error={forecast.error}
              onRetry={forecast.refetch}
            />
          </>
        )}
      </div>
    </div>
  );
}
