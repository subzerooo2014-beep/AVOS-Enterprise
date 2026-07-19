import { Injectable } from "@nestjs/common";
import {
  FoundationIntegrationTarget,
  IntegrationStatus,
} from "./foundation-production-integration.types";
import { FoundationProductionFileStoreService } from "./foundation-production-file-store.service";

@Injectable()
export class FoundationIntegrationRegistryService {
  constructor(
    private readonly store: FoundationProductionFileStoreService,
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

    const targets: Array<
      Omit<FoundationIntegrationTarget, "id" | "createdAt" | "updatedAt">
    > = [
      {
        key: "foundation-ultra",
        name: "AVOS Foundation Ultra",
        version: "AVOS-FOUNDATION-ULTRA-1.0.0",
        status: "certified",
        endpointHints: [
          "/avos/foundation/ultra-pack-e/certification/status",
          "/avos/foundation/ultra-pack-e/consolidation/status",
        ],
        required: true,
        dependencies: [],
        capabilities: [
          "digital-constitution",
          "enterprise-language",
          "digital-dna",
          "living-blueprint",
          "governance",
          "security",
          "privacy",
          "architecture-intelligence",
          "value-intelligence",
          "trust",
        ],
        certificationRequired: true,
        healthScore: 100,
      },
      {
        key: "enterprise-kernel",
        name: "AVOS Enterprise Kernel",
        version: "1.0.0",
        status: "connected",
        endpointHints: [],
        required: true,
        dependencies: ["foundation-ultra"],
        capabilities: [
          "lifecycle",
          "dependency-management",
          "health",
          "diagnostics",
          "plugin-runtime",
        ],
        certificationRequired: true,
        healthScore: 100,
      },
      {
        key: "capability-fabric",
        name: "AVOS Capability Fabric",
        version: "CF-1.0.0",
        status: "connected",
        endpointHints: [],
        required: true,
        dependencies: ["foundation-ultra", "enterprise-kernel"],
        capabilities: [
          "capability-registry",
          "capability-runtime",
          "orchestration",
          "governance",
        ],
        certificationRequired: true,
        healthScore: 100,
      },
      {
        key: "knowledge-fabric",
        name: "AVOS Knowledge Fabric",
        version: "KF-6.0.0",
        status: "connected",
        endpointHints: [],
        required: true,
        dependencies: [
          "foundation-ultra",
          "enterprise-kernel",
          "capability-fabric",
        ],
        capabilities: [
          "knowledge-ingestion",
          "knowledge-graph",
          "retrieval",
          "governance",
          "unified-search",
        ],
        certificationRequired: true,
        healthScore: 100,
      },
      {
        key: "intelligence-fabric",
        name: "AVOS Intelligence Fabric",
        version: "IF-6.0.0",
        status: "connected",
        endpointHints: [],
        required: true,
        dependencies: [
          "foundation-ultra",
          "enterprise-kernel",
          "capability-fabric",
          "knowledge-fabric",
        ],
        capabilities: [
          "reasoning",
          "multi-agent",
          "decisioning",
          "learning",
          "evolution",
        ],
        certificationRequired: true,
        healthScore: 100,
      },
      {
        key: "living-blueprint",
        name: "AVOS Living Blueprint",
        version: "1.0.0",
        status: "connected",
        endpointHints: [],
        required: true,
        dependencies: ["foundation-ultra"],
        capabilities: [
          "architecture-source-of-truth",
          "runtime-synchronization",
          "dependency-map",
        ],
        certificationRequired: true,
        healthScore: 100,
      },
      {
        key: "digital-genome",
        name: "AVOS Digital Genome",
        version: "1.0.0",
        status: "connected",
        endpointHints: [],
        required: true,
        dependencies: ["foundation-ultra", "living-blueprint"],
        capabilities: [
          "digital-dna-registry",
          "architectural-composition",
          "evolution-history",
        ],
        certificationRequired: true,
        healthScore: 100,
      },
      {
        key: "event-bus",
        name: "AVOS Enterprise Event Bus",
        version: "1.0.0",
        status: "connected",
        endpointHints: [],
        required: true,
        dependencies: ["enterprise-kernel"],
        capabilities: [
          "event-publication",
          "event-subscription",
          "audit-events",
          "integration-events",
        ],
        certificationRequired: false,
        healthScore: 100,
      },
      {
        key: "control-plane",
        name: "AVOS Unified Control Plane",
        version: "FPI-UCP-1.0.0",
        status: "registered",
        endpointHints: [
          "/avos/foundation/production/control-plane/status",
        ],
        required: true,
        dependencies: [
          "foundation-ultra",
          "enterprise-kernel",
          "capability-fabric",
          "knowledge-fabric",
          "intelligence-fabric",
          "living-blueprint",
          "digital-genome",
          "event-bus",
        ],
        capabilities: [
          "discovery",
          "health",
          "synchronization",
          "reconciliation",
          "verification",
          "certification",
        ],
        certificationRequired: true,
        healthScore: 100,
      },
    ];

    for (const target of targets) {
      this.register(target);
    }
  }

  register(
    input: Omit<FoundationIntegrationTarget, "id" | "createdAt" | "updatedAt">,
  ): FoundationIntegrationTarget {
    const existing = this.list().find((item) => item.key === input.key);

    if (existing) {
      return existing;
    }

    const timestamp = this.now();
    const record: FoundationIntegrationTarget = {
      ...input,
      id: this.id("integration-target"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`integration-targets/${record.id}.json`, record);
    return record;
  }

  list(): FoundationIntegrationTarget[] {
    return this.store.listJson<FoundationIntegrationTarget>(
      "integration-targets",
    );
  }

  getByKey(
    key: FoundationIntegrationTarget["key"],
  ): FoundationIntegrationTarget | undefined {
    return this.list().find((item) => item.key === key);
  }

  updateHealth(
    id: string,
    healthScore: number,
    status?: IntegrationStatus,
  ): FoundationIntegrationTarget {
    const target = this.list().find((item) => item.id === id);

    if (!target) {
      throw new Error(`Integration target not found: ${id}`);
    }

    const normalizedScore = Math.max(0, Math.min(100, healthScore));
    const derivedStatus: IntegrationStatus =
      status ??
      (normalizedScore >= 90
        ? target.certificationRequired
          ? "certified"
          : "connected"
        : normalizedScore >= 60
          ? "degraded"
          : "disconnected");

    const updated: FoundationIntegrationTarget = {
      ...target,
      healthScore: normalizedScore,
      status: derivedStatus,
      lastCheckedAt: this.now(),
      updatedAt: this.now(),
    };

    this.store.writeJson(`integration-targets/${updated.id}.json`, updated);
    return updated;
  }
}