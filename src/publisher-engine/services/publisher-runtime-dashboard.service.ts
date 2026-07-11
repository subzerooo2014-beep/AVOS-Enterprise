import { Injectable } from "@nestjs/common";
import { PublisherWorkerHealthService } from "./publisher-worker-health.service";
import { PublisherExecutionLogService } from "./publisher-execution-log.service";

@Injectable()
export class PublisherRuntimeDashboardService {
  constructor(
    private readonly workers: PublisherWorkerHealthService,
    private readonly logs: PublisherExecutionLogService,
  ) {}

  dashboard() {
    return {
      workers: this.workers.health(),
      executions: this.logs.latest(),
      generatedAt: new Date(),
    };
  }
}
