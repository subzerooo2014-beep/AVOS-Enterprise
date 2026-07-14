import { Injectable } from '@nestjs/common';
import { ProcessStage } from './enterprise-value-optimization.types';

@Injectable()
export class EnterpriseBottleneckAnalyzerService {
  analyze(stages: ProcessStage[]) {
    const ranked = stages
      .map((stage) => {
        const bottleneckScore =
          stage.waitTime * 0.45 +
          stage.errorRate * 0.35 +
          Math.max(0, 100 - stage.throughput) * 0.2;

        return {
          ...stage,
          bottleneckScore: Math.round(bottleneckScore),
        };
      })
      .sort(
        (left, right) => right.bottleneckScore - left.bottleneckScore,
      );

    return {
      ranked,
      primaryBottleneck: ranked[0] ?? null,
      criticalStages: ranked
        .filter((stage) => stage.bottleneckScore >= 60)
        .map((stage) => stage.id),
    };
  }
}