import { Injectable } from "@nestjs/common";
import type { FlowBenchmark } from "./core-flow-autonomy.types";

@Injectable()
export class CoreFlowBenchmarkService {
  private readonly benchmarks: FlowBenchmark[] = [];

  record(flow: string, metric: string, value: number, baseline: number) {
    const safeBaseline = Math.abs(Number(baseline || 0)) || 1;
    const benchmark: FlowBenchmark = {
      id: `benchmark_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow,
      metric,
      value: Number(value || 0),
      baseline: Number(baseline || 0),
      deltaPercent: Number(
        (((Number(value || 0) - Number(baseline || 0)) / safeBaseline) * 100).toFixed(2),
      ),
      recordedAt: new Date().toISOString(),
    };
    this.benchmarks.push(benchmark);
    return benchmark;
  }

  findAll(flow?: string) {
    return this.benchmarks.filter((item) => !flow || item.flow === flow).slice().reverse();
  }

  dashboard() {
    return {
      total: this.benchmarks.length,
      improved: this.benchmarks.filter((item) => item.deltaPercent > 0).length,
      regressed: this.benchmarks.filter((item) => item.deltaPercent < 0).length,
      unchanged: this.benchmarks.filter((item) => item.deltaPercent === 0).length,
      generatedAt: new Date().toISOString(),
    };
  }
}
