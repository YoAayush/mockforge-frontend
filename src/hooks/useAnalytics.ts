"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { fetchOverview, fetchUsage, fetchStatusCodes, ServiceContext } from "@/lib/analytics/analyticsService";
import { fetchEndpoints, fetchForecast } from "@/lib/analytics/analyticsService";
import type {
  AnalyticsFilters,
  AnalyticsOverview,
  AnalyticsUsage,
  EndpointAnalytics,
  StatusCodeDistribution,
  UsageForecast,
} from "@/types/analytics";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function toMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 401) {
      return "Your session has expired. Please sign in again.";
    }
    if (err.response?.status === 404) {
      return "Analytics API is unavailable. Make sure the backend with /usage routes is deployed.";
    }
    return err.response?.data?.message || err.response?.statusText || err.message || "Request failed";
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

export function useOverview(filters: AnalyticsFilters, token?: string | null) {
  const [state, setState] = useState<AsyncState<AnalyticsOverview>>({ data: null, loading: false, error: null });
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!filters.projectId) return;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchOverview(filters, { token, signal: controller.signal } as ServiceContext)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setState({ data: null, loading: false, error: toMessage(err) });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.projectId, filters.from, filters.to, filters.interval, token, tick]);

  return { ...state, refetch };
}

export function useUsage(filters: AnalyticsFilters, token?: string | null) {
  const [state, setState] = useState<AsyncState<AnalyticsUsage>>({ data: null, loading: false, error: null });
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!filters.projectId) return;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchUsage(filters, { token, signal: controller.signal } as ServiceContext)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setState({ data: null, loading: false, error: toMessage(err) });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.projectId, filters.from, filters.to, filters.interval, token, tick]);

  return { ...state, refetch };
}

export function useStatusCodes(filters: AnalyticsFilters, token?: string | null) {
  const [state, setState] = useState<AsyncState<StatusCodeDistribution>>({ data: null, loading: false, error: null });
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!filters.projectId) return;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchStatusCodes(filters, { token, signal: controller.signal } as ServiceContext)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setState({ data: null, loading: false, error: toMessage(err) });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.projectId, filters.from, filters.to, filters.interval, token, tick]);

  return { ...state, refetch };
}


export function useEndpoints(
  filters: AnalyticsFilters,
  token: string | null | undefined,
  page: number,
  pageSize: number,
  sortOrder: "asc" | "desc",
) {
  const [state, setState] = useState<AsyncState<EndpointAnalytics>>({ data: null, loading: false, error: null });
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!filters.projectId) return;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchEndpoints(filters, page, pageSize, sortOrder, { token, signal: controller.signal } as ServiceContext)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setState({ data: null, loading: false, error: toMessage(err) });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.projectId, filters.from, filters.to, filters.interval, token, page, pageSize, sortOrder, tick]);

  return { ...state, refetch };
}

export function useForecast(filters: AnalyticsFilters, token: string | null | undefined, overview: AnalyticsOverview | null) {
  const [state, setState] = useState<AsyncState<UsageForecast>>({ data: null, loading: false, error: null });
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!filters.projectId || !overview) return;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchForecast(filters, overview, { token, signal: controller.signal } as ServiceContext)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setState({ data: null, loading: false, error: toMessage(err) });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.projectId, filters.from, filters.to, filters.interval, token, overview, tick]);

  return { ...state, refetch };
}
