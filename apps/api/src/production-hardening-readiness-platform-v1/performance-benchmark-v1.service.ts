import { Injectable } from "@nestjs/common";
import type { PerformanceBenchmarkV1 } from "./production-hardening-readiness-v1.types";

@Injectable()
export class PerformanceBenchmarkV1Service {
  private readonly benchmarks: PerformanceBenchmarkV1[] = [];

  record(
    name: string,
    targetP95Ms: number,
    measuredP95Ms: number,
    targetThroughput: number,
    measuredThroughput: number,
  ): PerformanceBenchmarkV1 {
    const benchmark: PerformanceBenchmarkV1 = {
      id: `performance-benchmark-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      name,
      targetP95Ms,
      measuredP95Ms,
      targetThroughput,
      measuredThroughput,
      passed:
        measuredP95Ms <= targetP95Ms &&
        measuredThroughput >= targetThroughput,
      createdAt: new Date().toISOString(),
    };

    this.benchmarks.unshift(benchmark);
    return { ...benchmark };
  }

  list(): PerformanceBenchmarkV1[] {
    return this.benchmarks.map((item) => ({ ...item }));
  }

  count(): number {
    return this.benchmarks.length;
  }

  passedCount(): number {
    return this.benchmarks.filter((item) => item.passed).length;
  }
}
