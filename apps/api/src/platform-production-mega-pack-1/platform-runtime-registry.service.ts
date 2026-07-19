import { Injectable } from "@nestjs/common";
import {
  PlatformRuntimeComponent,
  PlatformRuntimeStatus,
} from "./platform-production-mega-pack-1.types";
import { PlatformProductionFileStoreService } from "./platform-production-file-store.service";

@Injectable()
export class PlatformRuntimeRegistryService {
  constructor(
    private readonly store: PlatformProductionFileStoreService,
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

    const components: Array<
      Omit<PlatformRuntimeComponent, "id" | "createdAt" | "updatedAt">
    > = [
      {
        key: "foundation-control-plane",
        name: "Foundation Unified Control Plane",
        version: "FPI-UCP-1.0.0",
        status: "certified",
        required: true,
        dependencies: [],
        capabilities: ["foundation-control", "health", "certification"],
        healthScore: 100,
      },
      {
        key: "enterprise-kernel",
        name: "Enterprise Kernel Runtime",
        version: "1.0.0",
        status: "running",
        required: true,
        dependencies: ["foundation-control-plane"],
        capabilities: ["lifecycle", "plugins", "dependencies", "diagnostics"],
        healthScore: 100,
      },
      {
        key: "capability-runtime",
        name: "Capability Fabric Runtime",
        version: "CF-1.0.0",
        status: "running",
        required: true,
        dependencies: ["foundation-control-plane", "enterprise-kernel"],
        capabilities: ["capabilities", "orchestration", "governance"],
        healthScore: 100,
      },
      {
        key: "knowledge-runtime",
        name: "Knowledge Fabric Runtime",
        version: "KF-6.0.0",
        status: "running",
        required: true,
        dependencies: [
          "foundation-control-plane",
          "enterprise-kernel",
          "capability-runtime",
        ],
        capabilities: ["ingestion", "graph", "retrieval", "search"],
        healthScore: 100,
      },
      {
        key: "intelligence-runtime",
        name: "Intelligence Fabric Runtime",
        version: "IF-6.0.0",
        status: "running",
        required: true,
        dependencies: [
          "foundation-control-plane",
          "enterprise-kernel",
          "capability-runtime",
          "knowledge-runtime",
        ],
        capabilities: ["reasoning", "agents", "decisions", "learning"],
        healthScore: 100,
      },
      {
        key: "event-runtime",
        name: "Enterprise Event Runtime",
        version: "1.0.0",
        status: "running",
        required: true,
        dependencies: ["enterprise-kernel"],
        capabilities: ["publish", "subscribe", "routing", "audit-events"],
        healthScore: 100,
      },
      {
        key: "blueprint-runtime",
        name: "Living Blueprint Runtime",
        version: "1.0.0",
        status: "running",
        required: true,
        dependencies: ["foundation-control-plane", "enterprise-kernel"],
        capabilities: ["architecture-sync", "runtime-map", "drift-detection"],
        healthScore: 100,
      },
      {
        key: "genome-runtime",
        name: "Digital Genome Runtime",
        version: "1.0.0",
        status: "running",
        required: true,
        dependencies: ["foundation-control-plane", "blueprint-runtime"],
        capabilities: ["digital-dna", "composition", "evolution-history"],
        healthScore: 100,
      },
      {
        key: "platform-runtime",
        name: "AVOS Unified Platform Runtime",
        version: "PPI-MP1-1.0.0",
        status: "registered",
        required: true,
        dependencies: [
          "foundation-control-plane",
          "enterprise-kernel",
          "capability-runtime",
          "knowledge-runtime",
          "intelligence-runtime",
          "event-runtime",
          "blueprint-runtime",
          "genome-runtime",
        ],
        capabilities: [
          "bootstrap",
          "lifecycle",
          "sessions",
          "context",
          "configuration",
          "health",
          "metrics",
          "discovery",
        ],
        healthScore: 100,
      },
    ];

    for (const component of components) {
      this.register(component);
    }
  }

  register(
    input: Omit<PlatformRuntimeComponent, "id" | "createdAt" | "updatedAt">,
  ): PlatformRuntimeComponent {
    const existing = this.list().find((item) => item.key === input.key);

    if (existing) {
      return existing;
    }

    const timestamp = this.now();
    const record: PlatformRuntimeComponent = {
      ...input,
      id: this.id("platform-runtime"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`runtime-registry/${record.id}.json`, record);
    return record;
  }

  list(): PlatformRuntimeComponent[] {
    return this.store.listJson<PlatformRuntimeComponent>("runtime-registry");
  }

  update(
    id: string,
    patch: Partial<
      Pick<
        PlatformRuntimeComponent,
        "status" | "healthScore" | "lastHeartbeatAt"
      >
    >,
  ): PlatformRuntimeComponent {
    const target = this.list().find((item) => item.id === id);

    if (!target) {
      throw new Error(`Runtime component not found: ${id}`);
    }

    const updated: PlatformRuntimeComponent = {
      ...target,
      ...patch,
      healthScore:
        patch.healthScore === undefined
          ? target.healthScore
          : Math.max(0, Math.min(100, patch.healthScore)),
      updatedAt: this.now(),
    };

    this.store.writeJson(`runtime-registry/${updated.id}.json`, updated);
    return updated;
  }

  setStatus(id: string, status: PlatformRuntimeStatus): PlatformRuntimeComponent {
    return this.update(id, {
      status,
      lastHeartbeatAt: this.now(),
    });
  }
}