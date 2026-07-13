import { Module } from "@nestjs/common";
import { EnterpriseE3Controller } from "./enterprise-e3.controller";
import { EnterpriseDistributedTaskService } from "./enterprise-distributed-task.service";
import { EnterpriseTelemetryService } from "./enterprise-telemetry.service";
import { EnterpriseIntegrationHealthService } from "./enterprise-integration-health.service";
import { EnterpriseRecoveryPolicyService } from "./enterprise-recovery-policy.service";
import { EnterpriseE3OrchestratorService } from "./enterprise-e3-orchestrator.service";

@Module({
  controllers: [EnterpriseE3Controller],
  providers: [
    EnterpriseDistributedTaskService,
    EnterpriseTelemetryService,
    EnterpriseIntegrationHealthService,
    EnterpriseRecoveryPolicyService,
    EnterpriseE3OrchestratorService,
  ],
  exports: [
    EnterpriseDistributedTaskService,
    EnterpriseTelemetryService,
    EnterpriseIntegrationHealthService,
    EnterpriseRecoveryPolicyService,
    EnterpriseE3OrchestratorService,
  ],
})
export class EnterpriseE3Module {}
