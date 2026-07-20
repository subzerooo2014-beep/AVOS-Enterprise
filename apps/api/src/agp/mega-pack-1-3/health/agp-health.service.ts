import { Injectable } from "@nestjs/common";
import { AgpEventBusService } from "../events/agp-event-bus.service";
import { AgpGovernanceService } from "../governance/agp-governance.service";
import { AgpIntegrationAdaptersService } from "../integration/agp-integration-adapters.service";
import { AgpGrowthMemoryService } from "../memory/agp-growth-memory.service";
import { AgpRegistryService } from "../registry/agp-registry.service";
import { AgpRuntimeService } from "../runtime/agp-runtime.service";
import { AgpStrategyService } from "../strategy/agp-strategy.service";
import { AgpGrowthBrainService } from "../intelligence/agp-growth-brain.service";
import { AgpOpportunityRadarService } from "../intelligence/agp-opportunity-radar.service";

@Injectable()
export class AgpHealthService {
  constructor(
    private readonly runtime: AgpRuntimeService,
    private readonly registry: AgpRegistryService,
    private readonly events: AgpEventBusService,
    private readonly strategies: AgpStrategyService,
    private readonly brain: AgpGrowthBrainService,
    private readonly opportunities: AgpOpportunityRadarService,
    private readonly memory: AgpGrowthMemoryService,
    private readonly integrations: AgpIntegrationAdaptersService,
    private readonly governance: AgpGovernanceService,
  ) {}

  status() {
    const runtime = this.runtime.snapshot();
    const registry = this.registry.snapshot();
    const eventHealth = this.events.health();
    const integrationHealth = this.integrations.health();
    const governance = this.governance.validate();
    const brainHistory = this.brain.history();

    const checks = {
      runtimeOperational: runtime.status === "operational",
      registryHealthy: registry.total > 0,
      eventFoundationHealthy: eventHealth.status === "operational",
      strategyPlatformHealthy: this.strategies.list().length >= 0,
      growthBrainHealthy: brainHistory.recommendations.length >= 0,
      opportunityRadarHealthy: this.opportunities.list().length >= 0,
      growthMemoryHealthy: this.memory.snapshot().total >= 0,
      integrationHealthy:
        integrationHealth.total === integrationHealth.healthy,
      governanceHealthy: Object.values(governance).every(Boolean),
    };

    const score = Math.round(
      (Object.values(checks).filter(Boolean).length /
        Object.keys(checks).length) *
        100,
    );

    return {
      name:
        "AVOS Growth Platform — Mega Pack 1–3 — Unified Foundation, Strategy & Growth Intelligence",
      version: "AGP-MP1-3-1.0.0",
      status: score === 100 ? "operational" : "degraded",
      score,
      checks,
      metrics: runtime.metrics,
      registry: registry.byType,
      events: eventHealth,
      integrations: integrationHealth,
      governance,
      generatedAt: new Date().toISOString(),
    };
  }
}