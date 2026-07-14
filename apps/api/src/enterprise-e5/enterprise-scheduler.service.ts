import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { EnterpriseJob } from "./enterprise-e5.types";
import { EnterpriseCommandBusService } from "./enterprise-command-bus.service";

@Injectable()
export class EnterpriseSchedulerService {
  private readonly jobs = new Map<string, EnterpriseJob>();

  constructor(private readonly commands: EnterpriseCommandBusService) {}

  register(
    name: string,
    schedule = "manual",
    enabled = true,
  ): EnterpriseJob {
    const job: EnterpriseJob = {
      id: randomUUID(),
      name,
      schedule,
      enabled,
      executions: 0,
    };

    this.jobs.set(job.id, job);
    return job;
  }

  run(id: string): EnterpriseJob {
    const job = this.jobs.get(id);
    if (!job) {
      throw new NotFoundException(`Enterprise job not found: ${id}`);
    }

    if (!job.enabled) {
      return job;
    }

    const command = this.commands.enqueue(job.name, {
      jobId: job.id,
      schedule: job.schedule,
    });

    this.commands.execute(command.id);
    job.executions += 1;
    job.lastRunAt = new Date().toISOString();
    return job;
  }

  list(): EnterpriseJob[] {
    return [...this.jobs.values()];
  }

  count(): number {
    return this.jobs.size;
  }
}