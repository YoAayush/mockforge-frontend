import axios from "axios";
import { isAnalyticsDemoMode } from "./config";
import {
  mockOverview,
  mockUsage,
  mockEndpoints,
  mockStatusCodes,
  mockForecast,
} from "./mockData";
import type {
  AnalyticsFilters,
  AnalyticsOverview,
  AnalyticsUsage,
  EndpointAnalytics,
  SortOrder,
  StatusCodeDistribution,
  UsageForecast,
} from "@/types/analytics";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

function authHeaders(token?: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function toNumber(v: unknown): number | undefined {
  if (v === undefined || v === null) return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function stripTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function analyticsParams(filters: AnalyticsFilters) {
  return {
    projectId: filters.projectId,
    from: filters.from,
    to: filters.to,
    granularity: filters.interval,
  };
}

function formatPeriodLabel(start?: string, end?: string): string {
  if (!start || !end) return "Current UTC month";
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "Current UTC month";
  }
  const formatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
}

// The backend records the raw request URL, e.g.
// /api/v1/mock/<projectId>/users?count=5. Strip the API prefix, project id and
// query string so the endpoint table shows the path users actually call.
function normalizeEndpointPath(endpoint: string, projectId: string): string {
  const withoutQuery = endpoint.split("?")[0] || endpoint;
  const marker = `/mock/${projectId}`;
  const markerIndex = withoutQuery.indexOf(marker);
  if (markerIndex >= 0) {
    const path = withoutQuery.slice(markerIndex + marker.length);
    return path.length > 0 ? path : "/";
  }
  return withoutQuery;
}

export interface ServiceContext {
  token?: string | null;
  signal?: AbortSignal;
}

// ── backend response shapes ────────────────────────────────────────────────

interface BackendMonthlyQuota {
  limit?: number;
  used?: number;
  remaining?: number;
  percentage?: number;
  resetAt?: string;
}

interface BackendUsageAnalytics {
  success?: boolean;
  range?: { start: string; end: string; granularity: "day" | "hour" };
  totalRequests?: number;
  averageDailyConsumption?: number;
  monthlyQuota?: BackendMonthlyQuota;
  timeSeries?: Array<{ bucket: string; requests: number; errors: number }>;
  endpointRankings?: Array<{ endpoint: string; method: string; requests: number }>;
  statusCodes?: Array<{ statusCode: number; count: number }>;
  errorTrends?: Array<{ bucket: string; requests: number; errors: number }>;
  latency?: { averageResponseTimeMs?: number; p95ResponseTimeMs?: number };
  estimatedQuotaExhaustionDate?: string | null;
}

interface BackendUsageSummary {
  success?: boolean;
  quota?: {
    scope?: string;
    policy?: string;
    periodStart?: string;
    periodEnd?: string;
    limit?: number;
    used?: number;
    remaining?: number;
    percentage?: number;
    resetAt?: string;
    warningThresholds?: number[];
    reachedThresholds?: number[];
  };
}

// ── overview ────────────────────────────────────────────────────────────────
// Combines /usage/analytics (range-scoped traffic) with /usage/summary
// (user-level monthly quota, thresholds and billing period).

function normalizeOverview(
  analytics: BackendUsageAnalytics,
  summary: BackendUsageSummary | null,
  filters: AnalyticsFilters,
): AnalyticsOverview {
  const mq = analytics.monthlyQuota ?? {};
  const q = summary?.quota ?? {};
  const used = toNumber(q.used ?? mq.used) ?? 0;
  const limit = toNumber(q.limit ?? mq.limit) ?? 0;
  const remainingRaw = toNumber(q.remaining ?? mq.remaining);
  const remaining = remainingRaw !== undefined ? Math.max(0, remainingRaw) : Math.max(0, limit - used);
  const percentage = toNumber(q.percentage ?? mq.percentage) ?? (limit > 0 ? (used / limit) * 100 : 0);

  const totalRequests = toNumber(analytics.totalRequests) ?? 0;
  const statusCodes = analytics.statusCodes ?? [];
  const failedFromCodes = statusCodes
    .filter((s) => Number(s.statusCode) >= 400)
    .reduce((acc, s) => acc + (toNumber(s.count) ?? 0), 0);
  const derivedSuccessful = Math.max(0, totalRequests - failedFromCodes);
  const successRate = totalRequests > 0 ? (derivedSuccessful / totalRequests) * 100 : undefined;
  const errorRate = totalRequests > 0 ? (failedFromCodes / totalRequests) * 100 : undefined;

  const warningThresholds = q.warningThresholds ?? [80, 90, 100];
  const reachedThresholds = q.reachedThresholds ?? warningThresholds.filter((t) => percentage >= t);

  return {
    totalRequests,
    // The current backend does not expose a previous-period aggregate.
    previousTotalRequests: undefined,
    quota: {
      used,
      limit,
      remaining,
      percentage,
      billingPeriodStart: q.periodStart,
      billingPeriodEnd: q.periodEnd,
      plan: q.policy?.toUpperCase(),
      resetAt: q.resetAt ?? mq.resetAt,
      warningThresholds,
      reachedThresholds,
    },
    successRate,
    successfulRequests: derivedSuccessful,
    failedRequests: failedFromCodes,
    avgResponseTimeMs: toNumber(analytics.latency?.averageResponseTimeMs),
    p95ResponseTimeMs: toNumber(analytics.latency?.p95ResponseTimeMs),
    errorRate,
    billingPeriodLabel: formatPeriodLabel(q.periodStart, q.periodEnd),
    selectedRangeLabel: `${new Date(filters.from).toLocaleDateString()} – ${new Date(filters.to).toLocaleDateString()}`,
  };
}

export async function fetchOverview(filters: AnalyticsFilters, ctx: ServiceContext = {}): Promise<AnalyticsOverview> {
  if (isAnalyticsDemoMode()) {
    await new Promise((r) => setTimeout(r, 300));
    return mockOverview(filters.from, filters.to);
  }

  const base = stripTrailingSlash(BASE_URL);
  const headers = authHeaders(ctx.token);

  // Analytics is required. Summary only enriches the quota card, so a summary
  // failure should not hide the rest of the dashboard.
  const [analyticsResult, summaryResult] = await Promise.allSettled([
    axios.get(`${base}/usage/analytics`, {
      params: analyticsParams(filters),
      headers,
      signal: ctx.signal,
    }),
    axios.get(`${base}/usage/summary`, {
      headers,
      signal: ctx.signal,
    }),
  ]);

  if (analyticsResult.status === "rejected") {
    throw analyticsResult.reason;
  }

  const summary =
    summaryResult.status === "fulfilled"
      ? (summaryResult.value.data as BackendUsageSummary)
      : null;

  return normalizeOverview(
    analyticsResult.value.data as BackendUsageAnalytics,
    summary,
    filters,
  );
}

// ── usage time series ──────────────────────────────────────────────────────
export async function fetchUsage(filters: AnalyticsFilters, ctx: ServiceContext = {}): Promise<AnalyticsUsage> {
  if (isAnalyticsDemoMode()) {
    await new Promise((r) => setTimeout(r, 300));
    return mockUsage(filters.interval);
  }

  const res = await axios.get(`${stripTrailingSlash(BASE_URL)}/usage/analytics`, {
    params: analyticsParams(filters),
    headers: authHeaders(ctx.token),
    signal: ctx.signal,
  });
  const data = res.data as BackendUsageAnalytics;
  const points = (data.timeSeries ?? []).map((p) => ({
    timestamp: p.bucket,
    count: toNumber(p.requests) ?? 0,
    previousCount: undefined,
  }));
  return { interval: (data.range?.granularity ?? filters.interval) as "hour" | "day", points };
}

// ── endpoints ──────────────────────────────────────────────────────────────
export async function fetchEndpoints(
  filters: AnalyticsFilters,
  page: number,
  pageSize: number,
  sortOrder: SortOrder,
  ctx: ServiceContext = {},
): Promise<EndpointAnalytics> {
  if (isAnalyticsDemoMode()) {
    await new Promise((r) => setTimeout(r, 300));
    return mockEndpoints(page, pageSize);
  }

  const res = await axios.get(`${stripTrailingSlash(BASE_URL)}/usage/analytics`, {
    params: analyticsParams(filters),
    headers: authHeaders(ctx.token),
    signal: ctx.signal,
  });
  const data = res.data as BackendUsageAnalytics;
  const rows = data.endpointRankings ?? [];
  const sorted = [...rows].sort((a, b) =>
    sortOrder === "asc"
      ? (a.requests ?? 0) - (b.requests ?? 0)
      : (b.requests ?? 0) - (a.requests ?? 0),
  );
  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize).map((r) => ({
    method: r.method,
    path: normalizeEndpointPath(r.endpoint, filters.projectId),
    total: toNumber(r.requests) ?? 0,
    // The current backend only returns aggregate request counts per endpoint.
    successful: undefined,
    failed: undefined,
    avgResponseTimeMs: undefined,
    errorRate: undefined,
  }));
  return { items, total: sorted.length, page, pageSize };
}

// ── status codes ───────────────────────────────────────────────────────────
export async function fetchStatusCodes(filters: AnalyticsFilters, ctx: ServiceContext = {}): Promise<StatusCodeDistribution> {
  if (isAnalyticsDemoMode()) {
    await new Promise((r) => setTimeout(r, 300));
    return mockStatusCodes();
  }

  const res = await axios.get(`${stripTrailingSlash(BASE_URL)}/usage/analytics`, {
    params: analyticsParams(filters),
    headers: authHeaders(ctx.token),
    signal: ctx.signal,
  });
  const data = res.data as BackendUsageAnalytics;
  const grouped = new Map<string, number>();
  for (const sc of data.statusCodes ?? []) {
    const code = Number(sc.statusCode);
    const category = `${Math.floor(code / 100)}xx`;
    grouped.set(category, (grouped.get(category) ?? 0) + (toNumber(sc.count) ?? 0));
  }
  const items = Array.from(grouped.entries()).map(([label, count]) => ({
    label,
    count,
    percentage: 0,
    category: label as "2xx" | "3xx" | "4xx" | "5xx",
  }));
  const total = items.reduce((acc, i) => acc + i.count, 0);
  for (const i of items) i.percentage = total > 0 ? (i.count / total) * 100 : 0;
  return { items, total };
}

// ── forecast ───────────────────────────────────────────────────────────────
export async function fetchForecast(filters: AnalyticsFilters, overview: AnalyticsOverview, ctx: ServiceContext = {}): Promise<UsageForecast> {
  if (isAnalyticsDemoMode()) {
    await new Promise((r) => setTimeout(r, 300));
    return mockForecast(overview);
  }

  const res = await axios.get(`${stripTrailingSlash(BASE_URL)}/usage/analytics`, {
    params: analyticsParams(filters),
    headers: authHeaders(ctx.token),
    signal: ctx.signal,
  });
  const data = res.data as BackendUsageAnalytics;
  const avgDaily = toNumber(data.averageDailyConsumption);
  const pct = overview.quota.percentage;
  const enoughData = data.estimatedQuotaExhaustionDate !== null && data.estimatedQuotaExhaustionDate !== undefined;
  return {
    averageDailyRequests: avgDaily,
    usageComparedToPreviousPercent: undefined,
    estimatedExhaustionDate: data.estimatedQuotaExhaustionDate ?? null,
    thresholdWarnings: overview.quota.warningThresholds?.map((t) => ({
      threshold: t,
      reached: overview.quota.reachedThresholds?.includes(t) ?? (pct ?? 0) >= t,
    })),
    enoughData,
    message: enoughData ? undefined : "Not enough data to estimate usage",
  };
}
