import { Injectable } from "@nestjs/common";
import {
  AgsSourceName,
  AgsSourceSnapshot,
} from "./adaptive-growth-studio-live-data.contracts";

@Injectable()
export class AdaptiveGrowthStudioLiveDataGateway {
  private readonly baseUrl =
    process.env.AVOS_INTERNAL_API_URL ?? "http://localhost:3000";

  private readonly candidates: Record<AgsSourceName, string[]> = {
    "adaptive-growth-platform": [
      "/avos/adaptive-growth-platform/status",
      "/avos/adaptive-growth-platform/health",
      "/avos/agp/status",
      "/avos/agp/health",
    ],
    "adaptive-growth-engine": [
      "/avos/adaptive-growth-engine/status",
      "/avos/adaptive-growth-engine/health",
      "/avos/growth-engine/status",
    ],
    "knowledge-fabric": [
      "/avos/knowledge-fabric/runtime/status",
      "/avos/knowledge-fabric/health",
      "/avos/knowledge-fabric/final-review/status",
    ],
    "capability-fabric": [
      "/avos/capability-fabric/runtime/status",
      "/avos/capability-fabric/health",
      "/avos/capability-fabric/certification/status",
    ],
  };

  async collectAll(): Promise<AgsSourceSnapshot[]> {
    return Promise.all(
      (Object.keys(this.candidates) as AgsSourceName[]).map((source) =>
        this.collect(source),
      ),
    );
  }

  private async collect(source: AgsSourceName): Promise<AgsSourceSnapshot> {
    const endpoints = this.candidates[source];
    let lastError = "No compatible endpoint responded.";

    for (const endpoint of endpoints) {
      const startedAt = Date.now();
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          headers: {
            "x-avos-internal-call": "adaptive-growth-studio",
          },
          signal: AbortSignal.timeout(3500),
        });

        if (!response.ok) {
          lastError = `${endpoint} returned HTTP ${response.status}`;
          continue;
        }

        const data = (await response.json()) as Record<string, unknown>;
        return {
          source,
          status: this.resolveStatus(data),
          endpoint,
          latencyMs: Date.now() - startedAt,
          observedAt: new Date().toISOString(),
          data,
        };
      } catch (error) {
        lastError =
          error instanceof Error ? error.message : "Unknown source error";
      }
    }

    return {
      source,
      status: "unavailable",
      endpoint: endpoints[0],
      latencyMs: 0,
      observedAt: new Date().toISOString(),
      data: {},
      error: lastError,
    };
  }

  private resolveStatus(
    data: Record<string, unknown>,
  ): "operational" | "degraded" | "unavailable" {
    const raw = String(
      data.status ?? data.health ?? data.level ?? "operational",
    ).toLowerCase();

    if (
      ["operational", "healthy", "excellent", "certified", "ready", "passed"].includes(
        raw,
      )
    ) {
      return "operational";
    }

    if (["degraded", "warning", "partial"].includes(raw)) {
      return "degraded";
    }

    return "operational";
  }
}