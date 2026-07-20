import { Injectable } from "@nestjs/common";

@Injectable()
export class AgpConversionOptimizationService {
  optimize(input: {
    funnelName: string;
    stages: Array<{
      name: string;
      conversionRate: number;
      frictionScore?: number;
    }>;
  }) {
    const ranked = input.stages
      .map((stage) => ({
        ...stage,
        opportunityScore: Number(
          (
            (1 - stage.conversionRate) * 70 +
            (stage.frictionScore ?? 0.5) * 30
          ).toFixed(2),
        ),
      }))
      .sort((a, b) => b.opportunityScore - a.opportunityScore);

    return {
      id: `agp-conversion-optimization:${Date.now()}`,
      funnelName: input.funnelName,
      priorityStage: ranked[0]?.name,
      recommendations: ranked.slice(0, 3).map((stage) => ({
        stage: stage.name,
        opportunityScore: stage.opportunityScore,
        action:
          stage.frictionScore && stage.frictionScore >= 0.7
            ? "Reduce friction and simplify the stage."
            : "Run a controlled conversion experiment.",
      })),
      requiresHumanApproval: true,
      generatedAt: new Date().toISOString(),
    };
  }
}