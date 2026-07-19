import { Injectable } from "@nestjs/common";
import { MeshServiceInstance } from "./platform-production-mega-pack-2.types";
import { ServiceMeshFileStoreService } from "./service-mesh-file-store.service";

@Injectable()
export class EnterpriseServiceRegistryService {
  constructor(
    private readonly store: ServiceMeshFileStoreService,
  ) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.list().length > 0) {
      return;
    }

    const services = [
      {
        serviceKey: "foundation-control-plane",
        serviceName: "Foundation Control Plane",
        version: "FPI-UCP-1.0.0",
        host: "localhost",
        port: 3000,
        protocol: "http" as const,
        environment: "production" as const,
        status: "certified" as const,
        weight: 100,
        priority: 1,
        region: "global",
        zone: "core",
        tags: ["foundation", "control-plane", "critical"],
        capabilities: ["health", "certification", "governance"],
        healthScore: 100,
        currentConnections: 0,
        maxConnections: 1000,
      },
      {
        serviceKey: "platform-runtime",
        serviceName: "Unified Platform Runtime",
        version: "PPI-MP1-1.0.0",
        host: "localhost",
        port: 3000,
        protocol: "http" as const,
        environment: "production" as const,
        status: "certified" as const,
        weight: 100,
        priority: 1,
        region: "global",
        zone: "runtime",
        tags: ["platform", "runtime", "critical"],
        capabilities: ["bootstrap", "lifecycle", "sessions", "health"],
        healthScore: 100,
        currentConnections: 0,
        maxConnections: 2000,
      },
      {
        serviceKey: "capability-fabric",
        serviceName: "Capability Fabric Service",
        version: "CF-1.0.0",
        host: "localhost",
        port: 3000,
        protocol: "http" as const,
        environment: "production" as const,
        status: "healthy" as const,
        weight: 90,
        priority: 2,
        region: "global",
        zone: "fabric",
        tags: ["capability", "orchestration"],
        capabilities: ["registry", "runtime", "orchestration"],
        healthScore: 100,
        currentConnections: 0,
        maxConnections: 1000,
      },
      {
        serviceKey: "knowledge-fabric",
        serviceName: "Knowledge Fabric Service",
        version: "KF-6.0.0",
        host: "localhost",
        port: 3000,
        protocol: "http" as const,
        environment: "production" as const,
        status: "healthy" as const,
        weight: 90,
        priority: 2,
        region: "global",
        zone: "fabric",
        tags: ["knowledge", "search", "graph"],
        capabilities: ["ingestion", "graph", "retrieval"],
        healthScore: 100,
        currentConnections: 0,
        maxConnections: 1000,
      },
      {
        serviceKey: "intelligence-fabric",
        serviceName: "Intelligence Fabric Service",
        version: "IF-6.0.0",
        host: "localhost",
        port: 3000,
        protocol: "http" as const,
        environment: "production" as const,
        status: "healthy" as const,
        weight: 90,
        priority: 2,
        region: "global",
        zone: "fabric",
        tags: ["intelligence", "reasoning", "agents"],
        capabilities: ["reasoning", "agents", "decisions"],
        healthScore: 100,
        currentConnections: 0,
        maxConnections: 1000,
      },
      {
        serviceKey: "enterprise-event-bus",
        serviceName: "Enterprise Event Bus",
        version: "1.0.0",
        host: "localhost",
        port: 3000,
        protocol: "event" as const,
        environment: "production" as const,
        status: "healthy" as const,
        weight: 100,
        priority: 1,
        region: "global",
        zone: "events",
        tags: ["events", "messaging", "critical"],
        capabilities: ["publish", "subscribe", "route"],
        healthScore: 100,
        currentConnections: 0,
        maxConnections: 5000,
      },
    ];

    for (const service of services) {
      this.register(service);
    }
  }

  register(
    input: Omit<MeshServiceInstance, "id" | "createdAt" | "updatedAt">,
  ): MeshServiceInstance {
    const existing = this.list().find(
      (item) =>
        item.serviceKey === input.serviceKey &&
        item.host === input.host &&
        item.port === input.port &&
        item.protocol === input.protocol,
    );

    if (existing) {
      return existing;
    }

    const timestamp = this.now();
    const record: MeshServiceInstance = {
      ...input,
      id: this.id("mesh-service"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`service-registry/${record.id}.json`, record);
    return record;
  }

  list(): MeshServiceInstance[] {
    return this.store.listJson<MeshServiceInstance>("service-registry");
  }

  discover(
    serviceKey: string,
    requiredTags: string[] = [],
  ): MeshServiceInstance[] {
    return this.list()
      .filter(
        (instance) =>
          instance.serviceKey === serviceKey &&
          ["healthy", "certified"].includes(instance.status) &&
          instance.healthScore >= 90 &&
          instance.currentConnections < instance.maxConnections &&
          requiredTags.every((tag) => instance.tags.includes(tag)),
      )
      .sort(
        (a, b) =>
          a.priority - b.priority ||
          b.weight - a.weight ||
          a.currentConnections - b.currentConnections,
      );
  }

  update(
    id: string,
    patch: Partial<MeshServiceInstance>,
  ): MeshServiceInstance {
    const target = this.list().find((item) => item.id === id);

    if (!target) {
      throw new Error(`Service instance not found: ${id}`);
    }

    const updated: MeshServiceInstance = {
      ...target,
      ...patch,
      healthScore:
        patch.healthScore === undefined
          ? target.healthScore
          : Math.max(0, Math.min(100, patch.healthScore)),
      updatedAt: this.now(),
    };

    this.store.writeJson(`service-registry/${updated.id}.json`, updated);
    return updated;
  }

  heartbeat(id: string, healthScore = 100): MeshServiceInstance {
    return this.update(id, {
      healthScore,
      lastHeartbeatAt: this.now(),
      status:
        healthScore >= 90
          ? "healthy"
          : healthScore >= 60
            ? "degraded"
            : "unavailable",
    });
  }
}