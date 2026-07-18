import { Injectable } from "@nestjs/common";
import { GeneratorExecutionResult } from "./generator-runtime.contracts";

export type GeneratorExecutionStatus =
  | "succeeded"
  | "failed";

export interface GeneratorExecutionHistoryRecord {
  executionId: string;
  pluginId: string;
  target: string;
  status: GeneratorExecutionStatus;
  success: boolean;
  startedAt: Date;
  finishedAt: Date;
  durationMs: number;
  warnings: string[];
  errors: string[];
  output?: unknown;
}

@Injectable()
export class ExecutionHistoryService {
  private readonly records =
    new Map<string, GeneratorExecutionHistoryRecord>();

  record(
    result: GeneratorExecutionResult
  ): GeneratorExecutionHistoryRecord {
    const record: GeneratorExecutionHistoryRecord = {
      executionId: result.executionId,
      pluginId: result.pluginId,
      target: result.target,
      status: result.success
        ? "succeeded"
        : "failed",
      success: result.success,
      startedAt: result.startedAt,
      finishedAt: result.finishedAt,
      durationMs: result.durationMs,
      warnings: [...result.warnings],
      errors: [...result.errors],
      output: result.output
    };

    this.records.set(record.executionId, record);

    return record;
  }

  get(
    executionId: string
  ): GeneratorExecutionHistoryRecord | undefined {
    return this.records.get(executionId);
  }

  list(
    limit = 100
  ): GeneratorExecutionHistoryRecord[] {
    const normalizedLimit = Math.max(
      1,
      Math.min(limit, 1000)
    );

    return [...this.records.values()]
      .sort(
        (left, right) =>
          right.startedAt.getTime() -
          left.startedAt.getTime()
      )
      .slice(0, normalizedLimit);
  }

  count(): number {
    return this.records.size;
  }

  clear(): void {
    this.records.clear();
  }
}
