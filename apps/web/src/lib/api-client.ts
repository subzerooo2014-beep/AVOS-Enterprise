import { avosConfig } from './config';
import type { ApiResult } from '@/types/avos';

const DEFAULT_TIMEOUT_MS = 5000;

export async function apiGet<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    DEFAULT_TIMEOUT_MS,
  );

  try {
    const response = await fetch(
      `${avosConfig.apiBaseUrl}${path}`,
      {
        ...options,
        method: 'GET',
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
          ...(options?.headers ?? {}),
        },
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      return {
        data: null,
        error: `API returned ${response.status}`,
        ok: false,
      };
    }

    return {
      data: (await response.json()) as T,
      error: null,
      ok: true,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown API error',
      ok: false,
    };
  } finally {
    clearTimeout(timeout);
  }
}