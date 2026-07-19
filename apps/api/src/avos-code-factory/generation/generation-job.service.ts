import { Injectable } from "@nestjs/common";
import {
  FactoryGenerationJob,
  FactoryGenerationJobStatus,
} from "../contracts/generation.contracts";
import { createFactoryId } from "../utils/factory-id.util";

@Injectable()
export class FactoryGenerationJobService {
  private readonly jobs = new Map<string, FactoryGenerationJob>();

  create(
    projectId: string,
    objective: string,
    metadata: Record<string, unknown> = {},
  ): FactoryGenerationJob {
    const job: FactoryGenerationJob = {
      id: createFactoryId("factory-generation-job"),
      projectId,
      status: "queued",
      objective,
      filesPlanned: 0,
      filesGenerated: 0,
      errors: [],
      startedAt: new Date().toISOString(),
      metadata,
    };

    this.jobs.set(job.id, job);
    return job;
  }

  transition(
    id: string,
    status: FactoryGenerationJobStatus,
    patch: Partial<FactoryGenerationJob> = {},
  ): FactoryGenerationJob {
    const job = this.require(id);
    Object.assign(job, patch, { status });

    if (status === "completed" || status === "failed") {
      const completedAt = new Date().toISOString();
      job.completedAt = completedAt;
      job.durationMs =
        new Date(completedAt).getTime() - new Date(job.startedAt).getTime();
    }

    return job;
  }

  fail(id: string, error: unknown): FactoryGenerationJob {
    const message = error instanceof Error ? error.message : String(error);
    const job = this.require(id);
    job.errors.push(message);
    return this.transition(id, "failed");
  }

  get(id: string) {
    return this.jobs.get(id);
  }

  list() {
    return [...this.jobs.values()].sort((a, b) =>
      b.startedAt.localeCompare(a.startedAt),
    );
  }

  private require(id: string): FactoryGenerationJob {
    const job = this.jobs.get(id);
    if (!job) {
      throw new Error(`Generation job '${id}' was not found.`);
    }
    return job;
  }
}
