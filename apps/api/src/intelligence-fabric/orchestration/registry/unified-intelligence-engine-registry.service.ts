import { Injectable } from "@nestjs/common";
import {
  IntelligenceEngineDescriptor,
  IntelligenceEngineHealth,
} from "../contracts/unified-intelligence-orchestration.contracts";

@Injectable()
export class UnifiedIntelligenceEngineRegistryService {
  private readonly engines = new Map<string, IntelligenceEngineDescriptor>();

  constructor() {
    this.registerDefaults();
  }

  register(
    descriptor: Omit<IntelligenceEngineDescriptor, "registeredAt"> & {
      readonly registeredAt?: string;
    },
  ): IntelligenceEngineDescriptor {
    const normalized: IntelligenceEngineDescriptor = {
      ...descriptor,
      capabilities: [...new Set(descriptor.capabilities)],
      registeredAt: descriptor.registeredAt ?? new Date().toISOString(),
    };

    this.engines.set(normalized.id, normalized);
    return normalized;
  }

  updateHealth(
    id: string,
    health: IntelligenceEngineHealth,
  ): IntelligenceEngineDescriptor | undefined {
    const current = this.engines.get(id);
    if (!current) return undefined;

    const updated: IntelligenceEngineDescriptor = {
      ...current,
      health,
    };

    this.engines.set(id, updated);
    return updated;
  }

  get(id: string): IntelligenceEngineDescriptor | undefined {
    return this.engines.get(id);
  }

  list(): readonly IntelligenceEngineDescriptor[] {
    return [...this.engines.values()];
  }

  available(): readonly IntelligenceEngineDescriptor[] {
    return this.list().filter(
      (engine) =>
        engine.enabled &&
        engine.health !== "unavailable",
    );
  }

  health(): Record<string, number> {
    const engines = this.list();

    return {
      total: engines.length,
      healthy: engines.filter((item) => item.health === "healthy").length,
      degraded: engines.filter((item) => item.health === "degraded").length,
      unavailable: engines.filter((item) => item.health === "unavailable")
        .length,
      enabled: engines.filter((item) => item.enabled).length,
    };
  }

  private registerDefaults(): void {
    const defaults: Array<
      Omit<IntelligenceEngineDescriptor, "registeredAt">
    > = [
      {
        id: "core-reasoning-engine",
        name: "AVOS Core Reasoning Engine",
        domain: "general",
        version: "1.0.0",
        capabilities: [
          "reasoning",
          "analysis",
          "recommendation",
          "decision-support",
        ],
        priority: "critical",
        health: "healthy",
        enabled: true,
      },
      {
        id: "knowledge-intelligence-engine",
        name: "AVOS Knowledge Intelligence Engine",
        domain: "knowledge",
        version: "1.0.0",
        capabilities: [
          "knowledge-query",
          "evidence-analysis",
          "context-enrichment",
        ],
        priority: "high",
        health: "healthy",
        enabled: true,
      },
      {
        id: "vehicle-intelligence-engine",
        name: "AVOS Vehicle Intelligence Engine",
        domain: "vehicles",
        version: "1.0.0",
        capabilities: [
          "vehicle-analysis",
          "vehicle-recommendation",
          "vehicle-risk",
        ],
        priority: "high",
        health: "healthy",
        enabled: true,
      },
      {
        id: "sales-intelligence-engine",
        name: "AVOS Sales Intelligence Engine",
        domain: "sales",
        version: "1.0.0",
        capabilities: [
          "sales-analysis",
          "lead-intelligence",
          "conversion-intelligence",
        ],
        priority: "normal",
        health: "healthy",
        enabled: true,
      },
      {
        id: "finance-intelligence-engine",
        name: "AVOS Finance Intelligence Engine",
        domain: "finance",
        version: "1.0.0",
        capabilities: [
          "finance-analysis",
          "risk-analysis",
          "forecasting",
        ],
        priority: "high",
        health: "healthy",
        enabled: true,
      },
      {
        id: "commerce-intelligence-engine",
        name: "AVOS Commerce Intelligence Engine",
        domain: "commerce",
        version: "1.0.0",
        capabilities: [
          "commerce-analysis",
          "market-intelligence",
          "pricing-intelligence",
        ],
        priority: "normal",
        health: "healthy",
        enabled: true,
      },
    ];

    for (const item of defaults) {
      this.register(item);
    }
  }
}