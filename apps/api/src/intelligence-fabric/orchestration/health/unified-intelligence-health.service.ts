import { Injectable } from "@nestjs/common";
import { IntelligenceOrchestrationEventBusService } from "../events/intelligence-orchestration-event-bus.service";
import { UnifiedIntelligenceObservabilityService } from "../monitoring/unified-intelligence-observability.service";
import { UnifiedIntelligenceEngineRegistryService } from "../registry/unified-intelligence-engine-registry.service";

@Injectable()
export class UnifiedIntelligenceHealthService {
  constructor(
    private readonly registry: UnifiedIntelligenceEngineRegistryService,
    private readonly observability: UnifiedIntelligenceObservabilityService,
    private readonly events: IntelligenceOrchestrationEventBusService,
  ) {}

  snapshot(): Record<string, unknown> {
    const registry = this.registry.health();
    const healthy =
      registry.total > 0 &&
      registry.unavailable < registry.total &&
      registry.enabled > 0;

    return {
      status: healthy ? "healthy" : "degraded",
      registry,
      observability: this.observability.snapshot(),
      events: {
        total: this.events.count(),
      },
      checkedAt: new Date().toISOString(),
    };
  }
}