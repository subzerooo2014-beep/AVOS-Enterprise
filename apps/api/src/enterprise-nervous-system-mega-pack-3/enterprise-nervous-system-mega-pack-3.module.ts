import { Module } from "@nestjs/common";
import { EnterpriseNervousSystemMegaPack3Controller } from "./enterprise-nervous-system-mega-pack-3.controller";
import { EnterpriseNervousSystemMegaPack3Service } from "./enterprise-nervous-system-mega-pack-3.service";
import { NervousWorkflowAuditService } from "./observability/nervous-workflow-audit.service";
import { NervousWorkflowRegistryService } from "./registry/nervous-workflow-registry.service";
import { NervousWorkflowTriggerService } from "./triggers/nervous-workflow-trigger.service";
import { NervousWorkflowStateService } from "./state/nervous-workflow-state.service";
import { NervousWorkflowApprovalService } from "./approval/nervous-workflow-approval.service";
import { NervousSagaService } from "./saga/nervous-saga.service";
import { NervousCompensationService } from "./compensation/nervous-compensation.service";
import { NervousWorkflowRuntimeService } from "./runtime/nervous-workflow-runtime.service";
import { NervousWorkflowHealthService } from "./health/nervous-workflow-health.service";

@Module({
  controllers: [
    EnterpriseNervousSystemMegaPack3Controller
  ],
  providers: [
    EnterpriseNervousSystemMegaPack3Service,
    NervousWorkflowAuditService,
    NervousWorkflowRegistryService,
    NervousWorkflowTriggerService,
    NervousWorkflowStateService,
    NervousWorkflowApprovalService,
    NervousSagaService,
    NervousCompensationService,
    NervousWorkflowRuntimeService,
    NervousWorkflowHealthService
  ],
  exports: [
    EnterpriseNervousSystemMegaPack3Service,
    NervousWorkflowAuditService,
    NervousWorkflowRegistryService,
    NervousWorkflowTriggerService,
    NervousWorkflowStateService,
    NervousWorkflowApprovalService,
    NervousSagaService,
    NervousCompensationService,
    NervousWorkflowRuntimeService,
    NervousWorkflowHealthService
  ]
})
export class EnterpriseNervousSystemMegaPack3Module {}
