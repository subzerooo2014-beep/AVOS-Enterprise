import { Injectable } from '@nestjs/common';
import { LoadTestResult } from './production-certification.types';

@Injectable()
export class LoadTestCertificationEngineService {
  summarize(results: LoadTestResult[]) {
    return {
      scenarios: results.length,
      totalVirtualUsers: results.reduce(
        (sum, result) => sum + result.virtualUsers,
        0,
      ),
      totalRequests: results.reduce(
        (sum, result) => sum + result.requests,
        0,
      ),
      averageErrorRate: Number(
        (
          results.reduce(
            (sum, result) => sum + result.errorRate,
            0,
          ) / Math.max(1, results.length)
        ).toFixed(4),
      ),
      maximumP95LatencyMs: Math.max(
        0,
        ...results.map((result) => result.p95LatencyMs),
      ),
      passed: results.every((result) => result.passed),
    };
  }
}