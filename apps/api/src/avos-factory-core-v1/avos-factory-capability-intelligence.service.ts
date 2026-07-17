import { Injectable } from "@nestjs/common";
import {
  AvosFactoryCapabilityIntelligence
} from "./avos-factory-intelligence.contracts";
import {
  AvosFactoryGenerationAnalyzerService
} from "./avos-factory-generation-analyzer.service";

@Injectable()
export class AvosFactoryCapabilityIntelligenceService {
  constructor(
    private readonly analyzer: AvosFactoryGenerationAnalyzerService
  ) {}

  calculate(): AvosFactoryCapabilityIntelligence[] {
    const analyses = this.analyzer.all();
    const capabilityIds = Array.from(
      new Set(
        analyses.flatMap((analysis) => analysis.reusedCapabilities)
      )
    );

    return capabilityIds
      .map((capabilityId) => {
        const records = analyses.filter(
          (analysis) => analysis.reusedCapabilities.includes(capabilityId)
        );

        const successfulUses = records.filter(
          (analysis) => analysis.success
        ).length;

        const failedUses = records.length - successfulUses;

        const averageQuality =
          records.length === 0
            ? 0
            : Math.round(
                records.reduce(
                  (sum, analysis) => sum + analysis.quality.overall,
                  0
                ) / records.length
              );

        const reuseScore = Math.min(
          100,
          Math.round(records.length * 12 + averageQuality * 0.55)
        );

        const trustScore =
          records.length === 0
            ? 0
            : Math.round(
                (successfulUses / records.length) * 70 +
                averageQuality * 0.3
              );

        const maturityScore = Math.min(
          100,
          Math.round(
            records.length * 10 +
            successfulUses * 8 +
            averageQuality * 0.35
          )
        );

        const mergeCandidates = capabilityIds
          .filter((candidate) => candidate !== capabilityId)
          .filter((candidate) => {
            const candidateRecords = analyses.filter(
              (analysis) => analysis.reusedCapabilities.includes(candidate)
            );

            return candidateRecords.some((candidateRecord) =>
              records.some((record) => record.subjectId === candidateRecord.subjectId)
            );
          })
          .slice(0, 5);

        return {
          capabilityId,
          uses: records.length,
          successfulUses,
          failedUses,
          reuseScore,
          trustScore,
          maturityScore,
          mergeCandidates,
          calculatedAt: new Date().toISOString()
        };
      })
      .sort((left, right) => right.reuseScore - left.reuseScore);
  }
}
