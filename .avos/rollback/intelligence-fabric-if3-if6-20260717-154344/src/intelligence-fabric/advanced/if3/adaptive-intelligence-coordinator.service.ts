import { Injectable } from "@nestjs/common";
import { UnifiedIntelligenceOrchestratorService } from "../../orchestration/orchestrator/unified-intelligence-orchestrator.service";
import {
  AdaptiveCoordinationRequest,
  AdaptiveCoordinationResult,
} from "../contracts/advanced-intelligence.contracts";
import { AdaptiveLearningMemoryService } from "./adaptive-learning-memory.service";

@Injectable()
export class AdaptiveIntelligenceCoordinatorService {
  constructor(
    private readonly orchestrator: UnifiedIntelligenceOrchestratorService,
    private readonly learning: AdaptiveLearningMemoryService,
  ) {}

  async coordinate(
    request: AdaptiveCoordinationRequest,
  ): Promise<AdaptiveCoordinationResult> {
    const decision = await this.orchestrator.execute({
      objective: request.objective,
      domain: request.domain,
      capability: request.capability,
      context: request.context,
      requireHumanApproval: request.requireHumanApproval,
    });

    const profiles = this.learning.profiles();
    const weights: Record<string, number> = {};

    for (const engineId of decision.selectedEngines) {
      const profile = profiles.find((item) => item.engineId === engineId);
      weights[engineId] = profile?.adaptiveWeight ?? 1;
    }

    for (const result of decision.engineResults) {
      this.learning.record({
        objective: request.objective,
        engineId: result.engineId,
        domain: request.domain ?? "general",
        confidence: result.confidence,
        outcome: result.confidence >= 0.7 ? "success" : "partial",
        reward: result.confidence,
        latencyMs: result.durationMs,
      });
    }

    return {
      id: `if3-coordination:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      selectedEngineIds: decision.selectedEngines,
      weights,
      recommendation: decision.recommendation,
      confidence: decision.confidence,
      requiresHumanApproval: decision.requiresHumanApproval,
      createdAt: new Date().toISOString(),
    };
  }
}