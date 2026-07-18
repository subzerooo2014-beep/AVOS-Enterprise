import { Injectable } from "@nestjs/common";
import {
  AvosFactoryTemplateIntelligence
} from "./avos-factory-intelligence.contracts";
import {
  AvosFactoryGenerationAnalyzerService
} from "./avos-factory-generation-analyzer.service";

@Injectable()
export class AvosFactoryTemplateIntelligenceService {
  constructor(
    private readonly analyzer: AvosFactoryGenerationAnalyzerService
  ) {}

  calculate(): AvosFactoryTemplateIntelligence[] {
    const analyses = this.analyzer.all();
    const templateIds = Array.from(
      new Set(
        analyses
          .map((analysis) => analysis.templateId)
          .filter((value): value is string => Boolean(value))
      )
    );

    return templateIds
      .map((templateId) => {
        const records = analyses.filter(
          (analysis) => analysis.templateId === templateId
        );
        const successes = records.filter(
          (analysis) => analysis.success
        ).length;
        const failures = records.length - successes;
        const averageQuality =
          records.length === 0
            ? 0
            : Math.round(
                records.reduce(
                  (sum, analysis) => sum + analysis.quality.overall,
                  0
                ) / records.length
              );
        const averageDurationMs =
          records.length === 0
            ? 0
            : Math.round(
                records.reduce(
                  (sum, analysis) => sum + analysis.durationMs,
                  0
                ) / records.length
              );
        const successRate =
          records.length === 0
            ? 0
            : Math.round((successes / records.length) * 100);
        const rankingScore = Math.round(
          successRate * 0.55 +
          averageQuality * 0.35 +
          Math.max(0, 100 - Math.min(100, averageDurationMs / 1000)) * 0.1
        );

        return {
          templateId,
          uses: records.length,
          successes,
          failures,
          successRate,
          averageQuality,
          averageDurationMs,
          rankingScore,
          lastUsedAt: records[0]?.analyzedAt
        };
      })
      .sort((left, right) => right.rankingScore - left.rankingScore);
  }
}
