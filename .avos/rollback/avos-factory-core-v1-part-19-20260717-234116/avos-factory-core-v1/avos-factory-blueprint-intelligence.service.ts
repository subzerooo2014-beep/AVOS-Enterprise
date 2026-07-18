import { Injectable } from "@nestjs/common";
import {
  AvosFactoryBlueprintIntelligence
} from "./avos-factory-intelligence.contracts";
import {
  AvosFactoryGenerationAnalyzerService
} from "./avos-factory-generation-analyzer.service";

@Injectable()
export class AvosFactoryBlueprintIntelligenceService {
  constructor(
    private readonly analyzer: AvosFactoryGenerationAnalyzerService
  ) {}

  calculate(): AvosFactoryBlueprintIntelligence[] {
    const analyses = this.analyzer.all();
    const blueprintIds = Array.from(
      new Set(
        analyses
          .map((analysis) => analysis.blueprintId)
          .filter((value): value is string => Boolean(value))
      )
    );

    return blueprintIds.map((blueprintId) => {
      const records = analyses.filter(
        (analysis) => analysis.blueprintId === blueprintId
      );

      const averageQuality =
        records.length === 0
          ? 0
          : Math.round(
              records.reduce(
                (sum, analysis) => sum + analysis.quality.overall,
                0
              ) / records.length
            );

      const architectureScore =
        records.length === 0
          ? 0
          : Math.round(
              records.reduce(
                (sum, analysis) => sum + analysis.quality.architecture,
                0
              ) / records.length
            );

      const duplicatePatternCount = records.filter(
        (analysis) => analysis.patterns.includes("strong-capability-reuse")
      ).length;

      const complexityPatternCount = records.filter(
        (analysis) =>
          analysis.patterns.includes("slow-generation") ||
          analysis.patterns.includes("warning-heavy-generation")
      ).length;

      const duplicationRisk = Math.max(
        0,
        Math.min(100, 60 - duplicatePatternCount * 10)
      );

      const complexityRisk =
        records.length === 0
          ? 0
          : Math.round((complexityPatternCount / records.length) * 100);

      const recommendations: string[] = [];

      if (architectureScore < 80) {
        recommendations.push("Strengthen blueprint architecture boundaries.");
      }

      if (complexityRisk > 40) {
        recommendations.push("Reduce blueprint complexity and generation stages.");
      }

      if (duplicationRisk > 50) {
        recommendations.push("Resolve reusable capabilities before adding components.");
      }

      return {
        blueprintId,
        uses: records.length,
        averageQuality,
        architectureScore,
        duplicationRisk,
        complexityRisk,
        recommendations,
        calculatedAt: new Date().toISOString()
      };
    });
  }
}
