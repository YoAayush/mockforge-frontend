export type AnalyticsPreset = "24h" | "7d" | "30d" | "custom";

export type AnalyticsInterval = "hour" | "day";

export interface DateRangeSelection {
  preset: AnalyticsPreset;
  from: string; // ISO timestamp (UTC)
  to: string; // ISO timestamp (UTC)
}

export interface AnalyticsFilters {
  projectId: string;
  from: string;
  to: string;
  interval: AnalyticsInterval;
}

export interface QuotaInfo {
  used: number;
  limit: number;
  remaining?: number;
  percentage?: number;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  plan?: string;
  resetAt?: string;
  warningThresholds?: number[];
  reachedThresholds?: number[];
}

export interface AnalyticsOverview {
  totalRequests: number;
  previousTotalRequests?: number;
  quota: QuotaInfo;
  successRate?: number;
  successfulRequests?: number;
  failedRequests?: number;
  avgResponseTimeMs?: number;
  p95ResponseTimeMs?: number;
  errorRate?: number;
  billingPeriodLabel?: string;
  selectedRangeLabel?: string;
}

export interface UsagePoint {
  timestamp: string;
  count: number;
  previousCount?: number;
}

export interface AnalyticsUsage {
  interval: AnalyticsInterval;
  points: UsagePoint[];
}

export type SortOrder = "asc" | "desc";

export interface EndpointStat {
  method: string;
  path: string;
  total: number;
  successful?: number;
  failed?: number;
  avgResponseTimeMs?: number;
  errorRate?: number;
}

export interface EndpointAnalytics {
  items: EndpointStat[];
  total: number;
  page: number;
  pageSize: number;
}

export interface StatusCodeBucket {
  label: string; // e.g. "2xx", "4xx", a specific code, etc.
  statusCode?: number;
  category?: "2xx" | "3xx" | "4xx" | "5xx";
  count: number;
  percentage?: number;
}

export interface StatusCodeDistribution {
  items: StatusCodeBucket[];
  total: number;
}

export interface ApiErrorRecord {
  id?: string;
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  category?: string;
  message?: string;
  responseTimeMs?: number;
}

export interface ApiErrorsResponse {
  items: ApiErrorRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UsageForecast {
  averageDailyRequests?: number;
  usageComparedToPreviousPercent?: number;
  estimatedExhaustionDate?: string | null;
  thresholdWarnings?: Array<{ threshold: number; reached: boolean; message?: string }>;
  enoughData: boolean;
  message?: string;
}

// Raw API envelope helpers (backend may wrap responses).
export interface ApiResponse<T> {
  data?: T;
  status?: number;
  success?: boolean;
  message?: string;
}
