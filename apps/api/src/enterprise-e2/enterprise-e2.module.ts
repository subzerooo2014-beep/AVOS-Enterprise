import { Module } from "@nestjs/common";
import { EnterpriseE2Controller } from "./enterprise-e2.controller";
import { EnterprisePolicyService } from "./enterprise-policy.service";
import { EnterpriseApprovalService } from "./enterprise-approval.service";
import { EnterpriseExecutionHistoryService } from "./enterprise-execution-history.service";
import { EnterpriseRuntimeStateService } from "./enterprise-runtime-state.service";
import { EnterpriseE2OrchestratorService } from "./enterprise-e2-orchestrator.service";

@Module({
  controllers: [EnterpriseE2Controller],
  providers: [
    EnterprisePolicyService,
    EnterpriseApprovalService,
    EnterpriseExecutionHistoryService,
    EnterpriseRuntimeStateService,
    EnterpriseE2OrchestratorService,
  ],
  exports: [
    EnterprisePolicyService,
    EnterpriseApprovalService,
    EnterpriseExecutionHistoryService,
    EnterpriseRuntimeStateService,
    EnterpriseE2OrchestratorService,
  ],
})
export class EnterpriseE2Module {}
