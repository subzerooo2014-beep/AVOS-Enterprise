import { Injectable } from "@nestjs/common";
import {
  IntelligenceEngineDescriptor,
  UnifiedIntelligenceRequest,
  UnifiedIntelligenceRoute,
} from "../contracts/unified-intelligence-orchestration.contracts";
import { UnifiedIntelligenceEngineRegistryService } from "../registry/unified-intelligence-engine-registry.service";

@Injectable()
export class UnifiedIntelligenceRouterService {
  constructor(
    private readonly registry: UnifiedIntelligenceEngineRegistryService,
  ) {}

  route(request: UnifiedIntelligenceRequest): UnifiedIntelligenceRoute {
    const correlationId =
      `if2-route:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;

    const available = this.registry.available();
    const ranked = available
      .map((engine) => ({
        engine,
        score: this.score(engine, request),
      }))
      .sort((a, b) => b.score - a.score);

    let selected = ranked
      .filter((item) => item.score > 0)
      .slice(0, 3)
      .map((item) => item.engine.id);

    if (request.preferredEngineId) {
      const preferred = available.find(
        (engine) => engine.id === request.preferredEngineId,
      );

      if (preferred) {
        selected = [
          preferred.id,
          ...selected.filter((id) => id !== preferred.id),
        ].slice(0, 3);
      }
    }

    if (selected.length === 0) {
      const fallback = available.find(
        (engine) => engine.id === "core-reasoning-engine",
      );
      if (fallback) selected = [fallback.id];
    }

    const rejected = available
      .map((engine) => engine.id)
      .filter((id) => !selected.includes(id));

    return {
      correlationId,
      selectedEngineIds: selected,
      rejectedEngineIds: rejected,
      reason:
        selected.length > 0
          ? `Selected ${selected.length} engine(s) using domain, capability, priority, and health scoring.`
          : "No eligible engines were available.",
      routedAt: new Date().toISOString(),
    };
  }

  private score(
    engine: IntelligenceEngineDescriptor,
    request: UnifiedIntelligenceRequest,
  ): number {
    let score = 0;

    if (engine.domain === "general") score += 10;
    if (request.domain && engine.domain === request.domain) score += 100;
    if (
      request.capability &&
      engine.capabilities.includes(request.capability)
    ) {
      score += 80;
    }

    const objective = request.objective.toLowerCase();

    if (objective.includes(engine.domain.toLowerCase())) score += 30;

    for (const capability of engine.capabilities) {
      const normalized = capability.replace(/-/g, " ").toLowerCase();
      if (objective.includes(normalized)) score += 15;
    }

    if (engine.priority === "critical") score += 20;
    if (engine.priority === "high") score += 15;
    if (engine.priority === "normal") score += 10;
    if (engine.health === "healthy") score += 20;
    if (engine.health === "degraded") score += 5;

    return score;
  }
}