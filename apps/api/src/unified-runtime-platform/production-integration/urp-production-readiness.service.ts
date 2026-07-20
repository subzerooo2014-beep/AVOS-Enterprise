import { Injectable } from "@nestjs/common";
import { UrpAdapterCatalogService } from "./urp-adapter-catalog.service";
import { UrpEndpointDiscoveryService } from "./urp-endpoint-discovery.service";

@Injectable()
export class UrpProductionReadinessService {
  constructor(
    private readonly catalog: UrpAdapterCatalogService,
    private readonly discovery: UrpEndpointDiscoveryService,
  ) {}

  async evaluate() {
    const units = [];

    for (const adapter of this.catalog.list()) {
      const health = await this.discovery.discover(adapter.key, "health");
      const readinessCandidates = this.catalog.candidates(
        adapter.key,
        "readiness",
      );
      const readiness =
        readinessCandidates.length > 0
          ? await this.discovery.discover(adapter.key, "readiness")
          : health;

      units.push({
        key: adapter.key,
        name: adapter.name,
        health,
        readiness,
        ready:
          health.status === "available" &&
          readiness.status === "available",
      });
    }

    const ready = units.filter((unit) => unit.ready).length;

    return {
      name: "URP Production Readiness",
      version: "URP-1.1.0",
      status: ready === units.length ? "ready" : "partially-ready",
      totalUnits: units.length,
      readyUnits: ready,
      unavailableUnits: units.length - ready,
      units,
      evaluatedAt: new Date().toISOString(),
    };
  }
}