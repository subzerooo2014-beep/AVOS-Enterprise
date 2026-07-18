import { Injectable } from "@nestjs/common";
import { GeneratorExecutionResult } from "./generator-runtime.contracts";

export interface PluginRuntimeMetric {
  pluginId: string;
  executions: number;
  successful: number;
  failed: number;
  totalDurationMs: number;
  averageDurationMs: number;
  lastExecutionAt?: Date;
}

export interface GeneratorRuntimeMetrics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  successRate: number;
  totalDurationMs: number;
  averageDurationMs: number;
  mostUsedPlugin?: string;
  lastExecutionAt?: Date;
  plugins: PluginRuntimeMetric[];
}

@Injectable()
export class RuntimeMetricsService {
  private totalExecutions = 0;
  private successfulExecutions = 0;
  private failedExecutions = 0;
  private totalDurationMs = 0;
  private lastExecutionAt?: Date;

  private readonly plugins =
    new Map<string, PluginRuntimeMetric>();

  record(result: GeneratorExecutionResult): void {
    this.totalExecutions += 1;
    this.totalDurationMs += result.durationMs;
    this.lastExecutionAt = result.finishedAt;

    if (result.success) {
      this.successfulExecutions += 1;
    } else {
      this.failedExecutions += 1;
    }

    const existing =
      this.plugins.get(result.pluginId) ?? {
        pluginId: result.pluginId,
        executions: 0,
        successful: 0,
        failed: 0,
        totalDurationMs: 0,
        averageDurationMs: 0
      };

    existing.executions += 1;
    existing.totalDurationMs += result.durationMs;
    existing.averageDurationMs =
      existing.totalDurationMs /
      existing.executions;
    existing.lastExecutionAt = result.finishedAt;

    if (result.success) {
      existing.successful += 1;
    } else {
      existing.failed += 1;
    }

    this.plugins.set(result.pluginId, existing);
  }

  getMetrics(): GeneratorRuntimeMetrics {
    const pluginMetrics = [...this.plugins.values()]
      .sort(
        (left, right) =>
          right.executions - left.executions
      );

    const successRate =
      this.totalExecutions === 0
        ? 0
        : (
            this.successfulExecutions /
            this.totalExecutions
          ) * 100;

    return {
      totalExecutions: this.totalExecutions,
      successfulExecutions:
        this.successfulExecutions,
      failedExecutions:
        this.failedExecutions,
      successRate: Number(
        successRate.toFixed(2)
      ),
      totalDurationMs: this.totalDurationMs,
      averageDurationMs:
        this.totalExecutions === 0
          ? 0
          : Number(
              (
                this.totalDurationMs /
                this.totalExecutions
              ).toFixed(2)
            ),
      mostUsedPlugin:
        pluginMetrics[0]?.pluginId,
      lastExecutionAt: this.lastExecutionAt,
      plugins: pluginMetrics
    };
  }

  reset(): void {
    this.totalExecutions = 0;
    this.successfulExecutions = 0;
    this.failedExecutions = 0;
    this.totalDurationMs = 0;
    this.lastExecutionAt = undefined;
    this.plugins.clear();
  }
}
