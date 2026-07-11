import { Injectable } from "@nestjs/common";
import { PublisherRuntimeMonitorService } from "./publisher-runtime-monitor.service";
import { PublisherExecutionLogService } from "./publisher-execution-log.service";

@Injectable()
export class PublisherEngineMonitorService {
  constructor(
    private readonly runtime: PublisherRuntimeMonitorService,
    private readonly log: PublisherExecutionLogService,
  ) {}

  monitor() {
    return {
      runtime: this.runtime.status(),
      executions: this.log.latest(50),
      generatedAt: new Date(),
    };
  }
}
