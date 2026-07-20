import { Injectable } from "@nestjs/common";
import { UrpAdapterCatalogService } from "./urp-adapter-catalog.service";
import {
  UrpAdapterOperation,
  UrpDiscoveredEndpoint,
} from "./urp-production.contracts";

@Injectable()
export class UrpEndpointDiscoveryService {
  private readonly discovered = new Map<string, UrpDiscoveredEndpoint>();

  constructor(private readonly catalog: UrpAdapterCatalogService) {}

  private baseUrl() {
    return process.env.AVOS_INTERNAL_API_BASE_URL ?? "http://localhost:3000";
  }

  async discover(
    unitKey: string,
    operation: UrpAdapterOperation,
  ): Promise<UrpDiscoveredEndpoint> {
    const candidates = this.catalog.candidates(unitKey, operation);

    for (const candidate of candidates) {
      const url = this.baseUrl() + candidate.path;
      const started = Date.now();

      try {
        const controller = new AbortController();
        const timer = setTimeout(
          () => controller.abort(),
          Number(process.env.AVOS_URP_DISCOVERY_TIMEOUT_MS ?? 2500),
        );

        const response = await fetch(url, {
          method: candidate.method,
          headers: { "content-type": "application/json" },
          body: candidate.method === "POST" ? JSON.stringify({ probe: true }) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timer);

        const endpoint: UrpDiscoveredEndpoint = {
          unitKey,
          operation,
          method: candidate.method,
          path: candidate.path,
          url,
          status: response.ok ? "available" : "unavailable",
          statusCode: response.status,
          latencyMs: Date.now() - started,
          discoveredAt: new Date().toISOString(),
        };

        if (response.ok) {
          this.discovered.set(unitKey + ":" + operation, endpoint);
          return endpoint;
        }
      } catch (error) {
        this.discovered.set(unitKey + ":" + operation, {
          unitKey,
          operation,
          method: candidate.method,
          path: candidate.path,
          url,
          status: "unavailable",
          latencyMs: Date.now() - started,
          discoveredAt: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const unavailable: UrpDiscoveredEndpoint = {
      unitKey,
      operation,
      method: candidates[0]?.method ?? "GET",
      path: candidates[0]?.path ?? "",
      url: candidates[0] ? this.baseUrl() + candidates[0].path : this.baseUrl(),
      status: "unavailable",
      discoveredAt: new Date().toISOString(),
      error: "No production endpoint candidate responded successfully.",
    };

    this.discovered.set(unitKey + ":" + operation, unavailable);
    return unavailable;
  }

  async discoverAll() {
    const results: UrpDiscoveredEndpoint[] = [];

    for (const adapter of this.catalog.list()) {
      results.push(await this.discover(adapter.key, "health"));

      if (this.catalog.candidates(adapter.key, "readiness").length > 0) {
        results.push(await this.discover(adapter.key, "readiness"));
      }
    }

    return results;
  }

  cached() {
    return [...this.discovered.values()];
  }

  getCached(unitKey: string, operation: UrpAdapterOperation) {
    return this.discovered.get(unitKey + ":" + operation);
  }
}