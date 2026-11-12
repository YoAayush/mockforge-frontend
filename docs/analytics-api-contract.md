# MockForge Analytics API Integration

Frontend dashboard route: `/{userId}/{projectId}/analytics`

The dashboard uses the backend API by default. Mock data is only used when
`NEXT_PUBLIC_ANALYTICS_DEMO_MODE="true"` is explicitly set; it is never enabled
automatically in development.

## Actual backend endpoints used

Base URL comes from `NEXT_PUBLIC_API_URL` (e.g. `/api/v1`). All requests require
`Authorization: Bearer <supabase access token>`.

- `GET /usage/analytics`
  - Query params: `projectId`, `from`, `to`, `granularity=hour|day`
  - Response:
    - `success`, `range: { start, end, granularity }`
    - `totalRequests`
    - `averageDailyConsumption`
    - `monthlyQuota: { limit, used, remaining, percentage, resetAt }`
    - `timeSeries: [{ bucket, requests, errors }]`
    - `endpointRankings: [{ endpoint, method, requests }]`
    - `statusCodes: [{ statusCode, count }]`
    - `errorTrends: [{ bucket, requests, errors }]`
    - `latency: { averageResponseTimeMs, p95ResponseTimeMs }`
    - `estimatedQuotaExhaustionDate: string | null`
- `GET /usage/summary`
  - Response: `{ success, quota: { scope, policy, periodStart, periodEnd, limit, used, remaining, percentage, resetAt, warningThresholds, reachedThresholds } }`

## Deployment requirement

The backend must expose the `/usage/*` routes. The local backend does; the
currently deployed backend may need to be redeployed before production traffic
can load analytics.

## Metrics not provided by the current backend

- Previous-period comparison (`previousTotalRequests`)
- Per-endpoint success/failed/latency/error-rate breakdown
- Endpoint-level error detail (recent request records)
- Previous-period percentage comparison in insights

These sections show unavailable states instead of fabricated values. The
endpoint table only displays request totals because that is all the endpoint
ranking API returns.
