export function isAnalyticsDemoMode(): boolean {
  // Analytics always uses the backend API by default. Mock data is opt-in so
  // local development cannot accidentally hide a broken API integration.
  return process.env.NEXT_PUBLIC_ANALYTICS_DEMO_MODE === "true";
}
