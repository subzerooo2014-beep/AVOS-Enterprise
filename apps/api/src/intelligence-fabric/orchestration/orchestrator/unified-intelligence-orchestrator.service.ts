import {
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import {
  IntelligenceEngineResult,
  UnifiedIntelligenceDecision,
  UnifiedIntelligenceRequest,
} from "../contracts/unified-intelligence-orchestration.contracts";
import { UnifiedIntelligenceDecisionEngineService } from "../decision/unified-intelligence-decision-engine.service";
import { IntelligenceOrchestrationEventBusService } from "../events/intelligence-orchestration-event-bus.service";
import { IntelligenceEngineExecutorService } from "../execution/intelligence-engine-executor.service";
import { CapabilityFabricIntelligenceAdapter } from "../integration/capability-fabric-intelligence.adapter";
import { KnowledgeFabricIntelligenceAdapter } from "../integration/knowledge-fabric-intelligence.adapter";
import { UnifiedIntelligenceObservabilityService } from "../monitoring/unified-intelligence-observability.service";
import { UnifiedIntelligenceEngineRegistryService } from "../registry/unified-intelligence-engine-registry.service";
import { UnifiedIntelligenceRouterService } from "../routing/unified-intelligence-router.service";

@Injectable()
export class UnifiedIntelligenceOrchestratorService {
  constructor(
    private readonly registry: UnifiedIntelligenceEngineRegistryService,
    private readonly router: UnifiedIntelligenceRouterService,
    private readonly executor: IntelligenceEngineExecutorService,
    private readonly decisionEngine: UnifiedIntelligenceDecisionEngineService,
    private readonly knowledgeAdapter: KnowledgeFabricIntelligenceAdapter,
    private readonly capabilityAdapter: CapabilityFabricIntelligenceAdapter,
    private readonly events: IntelligenceOrchestrationEventBusService,
    private readonly observability: UnifiedIntelligenceObservabilityService,
  ) {}

  async execute(
    request: UnifiedIntelligenceRequest,
  ): Promise<UnifiedIntelligenceDecision> {
    const startedAt = Date.now();

    try {
      const knowledgeEnriched = this.knowledgeAdapter.enrich(request);
      const enriched = this.capabilityAdapter.enrich(knowledgeEnriched);
      const route = this.router.route(enriched);

      this.events.emit(
        "intelligence.route.created",
        route.correlationId,
        {
          objective: enriched.objective,
          selectedEngineIds: route.selectedEngineIds,
        },
      );

      if (route.selectedEngineIds.length === 0) {
        throw new ServiceUnavailableException(
          "No intelligence engine is available.",
        );
      }

      const results: IntelligenceEngineResult[] = [];

      for (const engineId of route.selectedEngineIds) {
        const engine = this.registry.get(engineId);
        if (!engine) continue;

        const result = await this.executor.execute(engine, enriched);
        results.push(result);

        this.events.emit(
          "intelligence.engine.completed",
          route.correlationId,
          {
            engineId,
            confidence: result.confidence,
            durationMs: result.durationMs,
          },
        );
      }

      const decision = this.decisionEngine.resolve(
        enriched,
        route,
        results,
      );

      this.events.emit(
        "intelligence.decision.created",
        route.correlationId,
        {
          decisionId: decision.id,
          confidence: decision.confidence,
          requiresHumanApproval: decision.requiresHumanApproval,
        },
      );

      this.observability.recordSuccess(Date.now() - startedAt);
      return decision;
    } catch (error) {
      this.observability.recordFailure(Date.now() - startedAt);
      throw error;
    }
  }
}