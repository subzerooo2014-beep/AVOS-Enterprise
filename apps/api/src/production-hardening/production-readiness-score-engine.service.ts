import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductionReadinessScoreEngineService {
  calculate(input: {
    securityScore: number;
    performanceScore: number;
    scalabilityScore: number;
    reliabilityScore: number;
    recoveryScore: number;
    observabilityScore: number;
    configurationScore: number;
  }) {
    const score = Math.round(
      input.securityScore * 0.2 +
        input.performanceScore * 0.15 +
        input.scalabilityScore * 0.15 +
        input.reliabilityScore * 0.15 +
        input.recoveryScore * 0.15 +
        input.observabilityScore * 0.1 +
        input.configurationScore * 0.1,
    );

    return {
      ...input,
      score,
      status:
        score >= 95
          ? 'production-ready'
          : score >= 80
            ? 'conditional'
            : 'blocked',
    };
  }
}