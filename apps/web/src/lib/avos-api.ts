export const AVOS_API_BASE_URL =
  process.env.NEXT_PUBLIC_AVOS_API_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export type PlatformHealth = {
  status: "operational" | "degraded" | "offline";
  version?: string;
  score?: number;
  capabilities?: number;
  services?: number;
  endpoints?: number;
  modules?: number;
  controllers?: number;
  registries?: number;
  pipelines?: number;
  source?: string;
  checkedAt: string;
};

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function readNumber(record: UnknownRecord, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return undefined;
}

function readString(record: UnknownRecord, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return undefined;
}

export async function fetchPlatformHealth(
  signal?: AbortSignal,
): Promise<PlatformHealth> {
  const endpoints = [
    "/avos/factory/mega-pack-12-v2/status",
    "/health",
    "/foundation-control/health",
  ];

  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${AVOS_API_BASE_URL}${endpoint}`, {
        method: "GET",
        cache: "no-store",
        signal,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`${endpoint} returned ${response.status}`);
      }

      const payload = asRecord(await response.json());
      const metrics = asRecord(payload.metrics);

      return {
        status:
          readString(payload, "status") === "operational"
            ? "operational"
            : "degraded",
        version: readString(payload, "version"),
        score: readNumber(payload, "score", "architectureScore") ??
          readNumber(metrics, "score", "architectureScore"),
        capabilities:
          readNumber(payload, "capabilities") ??
          readNumber(metrics, "capabilities"),
        services:
          readNumber(payload, "services") ??
          readNumber(metrics, "services"),
        endpoints:
          readNumber(payload, "endpoints") ??
          readNumber(metrics, "endpoints"),
        modules:
          readNumber(payload, "modules") ??
          readNumber(metrics, "modules"),
        controllers:
          readNumber(payload, "controllers") ??
          readNumber(metrics, "controllers"),
        registries:
          readNumber(payload, "registries") ??
          readNumber(metrics, "registries"),
        pipelines:
          readNumber(payload, "pipelines") ??
          readNumber(metrics, "pipelines"),
        source: endpoint,
        checkedAt: new Date().toISOString(),
      };
    } catch (error) {
      if (signal?.aborted) {
        throw error;
      }
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("AVOS API is unavailable.");
}
