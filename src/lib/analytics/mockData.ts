import {
  AnalyticsOverview,
  AnalyticsUsage,
  EndpointAnalytics,
  StatusCodeDistribution,
  ApiErrorsResponse,
  UsageForecast,
  EndpointStat,
  UsagePoint,
  ApiErrorRecord,
} from "@/types/analytics";


function isoHoursAgo(hours: number) {
  return new Date(Date.now() - hours * 3600 * 1000).toISOString();
}

export function mockOverview(_from: string, to: string): AnalyticsOverview {
  const used = 7342;
  const limit = 10000;
  return {
    totalRequests: used,
    previousTotalRequests: 6100,
    quota: {
      used,
      limit,
      remaining: limit - used,
      percentage: (used / limit) * 100,
      billingPeriodStart: new Date(new Date().setDate(1)).toISOString(),
      billingPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString(),
      plan: "FREE",
    },
    successRate: 96.4,
    successfulRequests: 7078,
    failedRequests: 264,
    avgResponseTimeMs: 124,
    p95ResponseTimeMs: 312,
    errorRate: 3.6,
    billingPeriodLabel: "Current month",
    selectedRangeLabel: `${new Date(_from).toLocaleDateString()} - ${new Date(to).toLocaleDateString()}`,
  };
}

export function mockUsage(interval: "hour" | "day"): AnalyticsUsage {
  const points: UsagePoint[] = [];
  const count = interval === "hour" ? 24 : 7;
  const step = interval === "hour" ? 1 : 24;
  for (let i = count - 1; i >= 0; i--) {
    const ts = new Date(Date.now() - i * step * 3600 * 1000).toISOString();
    const base = interval === "hour" ? 180 + Math.round(Math.sin(i / 3) * 60) : 1200 + Math.round(Math.sin(i) * 200);
    points.push({ timestamp: ts, count: Math.max(0, base + Math.round((Math.random() - 0.5) * 40)), previousCount: Math.max(0, base - 30) });
  }
  return { interval, points };
}

const endpointRows: EndpointStat[] = [
  { method: "GET", path: "/users/:id", total: 3210, successful: 3140, failed: 70, avgResponseTimeMs: 98, errorRate: 2.2 },
  { method: "POST", path: "/users", total: 1245, successful: 1180, failed: 65, avgResponseTimeMs: 182, errorRate: 5.2 },
  { method: "GET", path: "/products", total: 980, successful: 975, failed: 5, avgResponseTimeMs: 74, errorRate: 0.5 },
  { method: "GET", path: "/orders", total: 760, successful: 730, failed: 30, avgResponseTimeMs: 133, errorRate: 3.9 },
  { method: "DELETE", path: "/users/:id", total: 210, successful: 198, failed: 12, avgResponseTimeMs: 65, errorRate: 5.7 },
];

export function mockEndpoints(page: number, pageSize: number): EndpointAnalytics {
  const start = (page - 1) * pageSize;
  const items = endpointRows.slice(start, start + pageSize);
  return { items, total: endpointRows.length, page, pageSize };
}

export function mockStatusCodes(): StatusCodeDistribution {
  const items = [
    { label: "2xx", category: "2xx" as const, count: 7078 },
    { label: "3xx", category: "3xx" as const, count: 42 },
    { label: "4xx", category: "4xx" as const, count: 201 },
    { label: "5xx", category: "5xx" as const, count: 63 },
  ];
  const total = items.reduce((a, b) => a + b.count, 0);
  return { items: items.map((i) => ({ ...i, percentage: (i.count / total) * 100 })), total };
}

export function mockErrors(): ApiErrorsResponse {
  const items: ApiErrorRecord[] = [
    { id: "1", timestamp: isoHoursAgo(0.5), method: "POST", path: "/users", statusCode: 422, category: "Validation", message: "Missing required field: email", responseTimeMs: 45 },
    { id: "2", timestamp: isoHoursAgo(1.2), method: "GET", path: "/products/:id", statusCode: 404, category: "Not Found", message: "Resource not found", responseTimeMs: 22 },
    { id: "3", timestamp: isoHoursAgo(2), method: "GET", path: "/orders", statusCode: 500, category: "Server Error", message: "Internal server error", responseTimeMs: 512 },
    { id: "4", timestamp: isoHoursAgo(3), method: "DELETE", path: "/users/:id", statusCode: 401, category: "Unauthorized", message: "Invalid token", responseTimeMs: 18 },
  ];
  return { items, total: items.length, page: 1, pageSize: items.length };
}

export function mockForecast(overview: AnalyticsOverview): UsageForecast {
  const used = overview.quota.used;
  const limit = overview.quota.limit;
  const avgDaily = 245;
  const remaining = Math.max(0, (overview.quota.remaining ?? limit - used));
  const daysLeft = avgDaily > 0 ? remaining / avgDaily : null;
  const exhaustion = daysLeft !== null ? new Date(Date.now() + daysLeft * 24 * 3600 * 1000).toISOString() : null;
  return {
    averageDailyRequests: avgDaily,
    usageComparedToPreviousPercent: overview.previousTotalRequests
      ? ((overview.totalRequests - overview.previousTotalRequests) / overview.previousTotalRequests) * 100
      : undefined,
    estimatedExhaustionDate: remaining > 0 ? exhaustion : null,
    thresholdWarnings: [
      { threshold: 80, reached: used / limit >= 0.8 },
      { threshold: 90, reached: used / limit >= 0.9 },
      { threshold: 100, reached: used / limit >= 1 },
    ],
    enoughData: true,
    message: remaining <= 0 ? "Quota exhausted" : undefined,
  };
}
