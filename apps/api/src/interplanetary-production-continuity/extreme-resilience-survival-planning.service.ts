import { Injectable } from "@nestjs/common";
import { InterplanetaryProductionContinuityStore } from "./interplanetary-production-continuity.store";

@Injectable()
export class ExtremeResilienceSurvivalPlanningService {
  constructor(private readonly store: InterplanetaryProductionContinuityStore) {}

  assess() {
    const operationalNodes = this.store.nodes.filter((node) => node.status === "operational");
    const resilienceScore = operationalNodes.length
      ? Number((operationalNodes.reduce((sum, node) => sum + node.resilienceScore, 0) / operationalNodes.length).toFixed(2))
      : 0;

    return {
      id: this.store.id("extreme-resilience-assessment"),
      civilizationContinuityScore: resilienceScore,
      independentProductionDomains: operationalNodes.length,
      knowledgeReplicationReady: this.store.memoryArtifacts.length > 0,
      recoveryPlansReady: this.store.recoveryPlans.some((plan) => plan.status === "ready" || plan.status === "activated"),
      minimumViableCivilizationCapabilities: [
        "knowledge",
        "governance",
        "energy",
        "production",
        "health",
        "communications",
        "habitat",
      ],
      protectedPrinciples: [
        "human-final-authority",
        "foundation-first",
        "global-compliance-readiness",
        "civilization-memory-integrity",
        "no-autonomous-constitutional-overwrite",
      ],
      status: resilienceScore >= 90 ? "excellent" : "review-required",
      createdAt: this.store.now(),
    };
  }
}