import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  EtlExecutionRecord,
  EtlPipelineRecord,
} from "./enterprise-data-foundation.types";

@Injectable()
export class EtlRuntimeService {
  private readonly pipelines = new Map<string, EtlPipelineRecord>();
  private readonly executions: EtlExecutionRecord[] = [];

  registerPipeline(
    input: Omit<EtlPipelineRecord, "version">,
  ): EtlPipelineRecord {
    const existing = this.pipelines.get(input.id);

    const pipeline: EtlPipelineRecord = {
      ...input,
      steps: [...input.steps],
      version: (existing?.version ?? 0) + 1,
    };

    this.pipelines.set(pipeline.id, pipeline);
    return this.clonePipeline(pipeline);
  }

  execute(
    pipelineId: string,
    recordsRead: number,
    recordsWritten: number,
    error?: string,
  ): EtlExecutionRecord {
    const pipeline = this.pipelines.get(pipelineId);

    if (!pipeline) {
      throw new NotFoundException(`ETL pipeline '${pipelineId}' was not found.`);
    }

    const startedAt = new Date().toISOString();
    const execution: EtlExecutionRecord = {
      id: `etl-exec-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      pipelineId,
      status: error ? "FAILED" : "COMPLETED",
      recordsRead,
      recordsWritten,
      startedAt,
      completedAt: new Date().toISOString(),
      error,
    };

    this.executions.unshift(execution);

    if (this.executions.length > 5000) {
      this.executions.length = 5000;
    }

    return { ...execution };
  }

  pipelinesList(): EtlPipelineRecord[] {
    return Array.from(this.pipelines.values()).map((pipeline) =>
      this.clonePipeline(pipeline),
    );
  }

  executionsList(): EtlExecutionRecord[] {
    return this.executions.map((execution) => ({ ...execution }));
  }

  pipelineCount(): number {
    return this.pipelines.size;
  }

  executionCount(): number {
    return this.executions.length;
  }

  failedExecutionCount(): number {
    return this.executions.filter((execution) => execution.status === "FAILED")
      .length;
  }

  private clonePipeline(pipeline: EtlPipelineRecord): EtlPipelineRecord {
    return {
      ...pipeline,
      steps: [...pipeline.steps],
    };
  }
}
