import { Body, Controller, Get, Post } from "@nestjs/common";
import { EnterpriseE3OrchestratorService } from "./enterprise-e3-orchestrator.service";
import { EnterpriseDistributedTaskService } from "./enterprise-distributed-task.service";
import { EnterpriseTelemetryService } from "./enterprise-telemetry.service";

@Controller("enterprise-e3")
export class EnterpriseE3Controller {
  constructor(
    private readonly orchestrator: EnterpriseE3OrchestratorService,
    private readonly tasks: EnterpriseDistributedTaskService,
    private readonly telemetry: EnterpriseTelemetryService,
  ) {}

  @Post("execute")
  execute(@Body() body: any) {
    return this.orchestrator.execute(body);
  }

  @Get("status")
  status() {
    return this.orchestrator.status();
  }

  @Get("tasks")
  tasksList() {
    return {
      success: true,
      records: this.tasks.list(),
    };
  }

  @Get("telemetry")
  telemetryList() {
    return {
      success: true,
      records: this.telemetry.list(),
      summary: this.telemetry.summary(),
    };
  }
}
