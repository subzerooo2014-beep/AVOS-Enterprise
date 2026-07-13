import { Injectable } from "@nestjs/common";
import { VehicleEnterpriseOrchestratorService } from "../intelligence/vehicle-enterprise-orchestrator.service";
import { VehicleIntelligenceResult } from "../intelligence/vehicle-intelligence.types";

export interface VehicleIntelligenceDecisionSignal {
  intelligence: VehicleIntelligenceResult;
  adjustedQualityScore: number;
  requiresManualReview: boolean;
  blocksPublishing: boolean;
  reasons: string[];
}

@Injectable()
export class VehicleIntelligenceDecisionService {
  constructor(
    private readonly intelligence: VehicleEnterpriseOrchestratorService,
  ) {}

  evaluate(vehicle: any, readinessScore: number): VehicleIntelligenceDecisionSignal {
    const intelligence = this.intelligence.analyze(vehicle);
    const adjustedQualityScore = Math.round(
      readinessScore * 0.55 + intelligence.confidence * 0.45,
    );

    const blocksPublishing = intelligence.risk === "HIGH";
    const requiresManualReview =
      intelligence.risk === "MEDIUM" || intelligence.confidence < 75;

    const reasons = [
      ...intelligence.recommendations,
      ...(blocksPublishing ? ["vehicle-intelligence-high-risk"] : []),
      ...(requiresManualReview ? ["vehicle-intelligence-review-required"] : []),
    ];

    return {
      intelligence,
      adjustedQualityScore,
      requiresManualReview,
      blocksPublishing,
      reasons,
    };
  }
}
