'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  retry?: number;
  retryDelay?: number;
  timeout?: number;
}

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  abort: () => void;
}

/**
 * useFetch - Custom hook for fetching data with retry and timeout support
 * @param url - The URL to fetch from
 * @param options - Fetch options
 */
export function useFetch<T>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    retry = 0,
    retryDelay = 1000,
    timeout = 30000,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);

  const fetchData = useCallback(async () => {
    // Abort any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError(null);

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        signal: abortController.signal,
      };

      if (body && method !== 'GET') {
        fetchOptions.body = JSON.stringify(body);
      }

      // Create timeout
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, timeout);

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      setLoading(false);
      retryCountRef.current = 0;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was aborted, don't update state
        return;
      }

      const error = err instanceof Error ? err : new Error('An error occurred');

      // Retry logic
      if (retryCountRef.current < retry) {
        retryCountRef.current += 1;
        setTimeout(fetchData, retryDelay);
        return;
      }

      setError(error);
      setLoading(false);
    }
  }, [url, method, headers, body, retry, retryDelay, timeout]);

  const refetch = useCallback(async () => {
    retryCountRef.current = 0;
    await fetchData();
  }, [fetchData]);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return { data, loading, error, refetch, abort };
}

/**
 * useDebouncedFetch - Fetch with debounce to prevent rapid requests
 * @param url - The URL to fetch from
 * @param delay - Debounce delay in ms
 * @param options - Fetch options
 */
export function useDebouncedFetch<T>(
  url: string,
  delay: number,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        signal: abortController.signal,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      setError(err instanceof Error ? err : new Error('An error occurred'));
      setLoading(false);
    }
  }, [url, options.method, options.headers, options.body]);

  const debouncedFetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchData();
    }, delay);
  }, [fetchData, delay]);

  useEffect(() => {
    debouncedFetch();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedFetch]);

  const refetch = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await fetchData();
  }, [fetchData]);

  const abort = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return { data, loading, error, refetch, abort };
}
