import { Injectable } from '@nestjs/common';
import { LoadTestResult } from './production-certification.types';

@Injectable()
export class PerformanceCertificationEngineService {
  certify(results: LoadTestResult[]) {
    const evaluated = results.map((result) => ({
      ...result,
      passed:
        result.passed &&
        result.errorRate <= 0.01 &&
        result.p95LatencyMs <= 1000 &&
        result.throughputPerSecond > 0,
    }));

    const score = Math.round(
      (evaluated.filter((result) => result.passed).length /
        Math.max(1, evaluated.length)) *
        100,
    );

    return {
      results: evaluated,
      score,
      certified: score === 100,
      failures: evaluated
        .filter((result) => !result.passed)
        .map((result) => result.id),
    };
  }
}