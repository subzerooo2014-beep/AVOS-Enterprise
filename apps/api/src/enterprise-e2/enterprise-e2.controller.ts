import { Body, Controller, Get, Post } from "@nestjs/common";
import { EnterpriseE2OrchestratorService } from "./enterprise-e2-orchestrator.service";
import { EnterpriseApprovalService } from "./enterprise-approval.service";
import { EnterpriseExecutionHistoryService } from "./enterprise-execution-history.service";
import { EnterpriseRuntimeStateService } from "./enterprise-runtime-state.service";

@Controller("enterprise-e2")
export class EnterpriseE2Controller {
  constructor(
    private readonly orchestrator: EnterpriseE2OrchestratorService,
    private readonly approvals: EnterpriseApprovalService,
    private readonly history: EnterpriseExecutionHistoryService,
    private readonly runtime: EnterpriseRuntimeStateService,
  ) {}

  @Post("execute")
  execute(@Body() body: any) {
    return this.orchestrator.execute(body);
  }

  @Get("status")
  status() {
    return this.orchestrator.status();
  }

  @Get("approvals")
  approvalsList() {
    return { success: true, records: this.approvals.list() };
  }

  @Get("executions")
  executions() {
    return { success: true, records: this.history.list() };
  }

  @Get("runtime-state")
  runtimeState() {
    return { success: true, records: this.runtime.list() };
  }
}
