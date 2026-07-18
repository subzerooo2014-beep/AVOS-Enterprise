import { Injectable } from "@nestjs/common";
import { BrainRecommendation } from "./intelligence-foundation.types";
import { KnowledgeFabricService } from "./knowledge-fabric.service";
import { LivingBlueprintService } from "./living-blueprint.service";
import { DigitalDnaService } from "./digital-dna.service";

@Injectable()
export class EnterpriseBrainFoundationService {
  private readonly recommendations = new Map<string, BrainRecommendation>();
  private readonly operationalMemory: Array<{
    event: string;
    context: Record<string, unknown>;
    recordedAt: string;
  }> = [];

  constructor(
    private readonly knowledge: KnowledgeFabricService,
    private readonly blueprints: LivingBlueprintService,
    private readonly digitalDna: DigitalDnaService,
  ) {}

  remember(event: string, context: Record<string, unknown>): void {
    this.operationalMemory.push({
      event,
      context,
      recordedAt: new Date().toISOString(),
    });
  }

  recommend(title: string, rationale: string, risk: "low" | "medium" | "high"): BrainRecommendation {
    const id = `recommendation:${Date.now()}:${this.recommendations.size + 1}`;
    const confidence = Math.min(
      0.99,
      0.6 +
        this.knowledge.count() * 0.03 +
        this.blueprints.count() * 0.04 +
        this.digitalDna.count() * 0.02,
    );

    const recommendation: BrainRecommendation = {
      id,
      title,
      rationale,
      confidence: Number(confidence.toFixed(2)),
      risk,
      requiresHumanApproval: true,
      status: "proposed",
      createdAt: new Date().toISOString(),
    };

    this.recommendations.set(id, recommendation);
    this.remember("recommendation-created", { recommendationId: id, risk });
    return recommendation;
  }

  decide(
    id: string,
    decision: "approved" | "rejected",
    approvedBy: string,
  ): BrainRecommendation | undefined {
    const recommendation = this.recommendations.get(id);
    if (!recommendation) return undefined;

    const updated: BrainRecommendation = {
      ...recommendation,
      status: decision,
    };

    this.recommendations.set(id, updated);
    this.remember("recommendation-decision", {
      recommendationId: id,
      decision,
      approvedBy,
    });

    return updated;
  }

  findAllRecommendations(): BrainRecommendation[] {
    return [...this.recommendations.values()];
  }

  getOperationalMemory(): Array<{
    event: string;
    context: Record<string, unknown>;
    recordedAt: string;
  }> {
    return [...this.operationalMemory];
  }

  count(): number {
    return this.recommendations.size;
  }
}
