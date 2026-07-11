import { Module } from "@nestjs/common";

import {
  ProductionHardeningV8MegaPack4Bootstrap,
} from "./bootstrap/production-hardening-v8-mega-pack-4.bootstrap";

import {
  ProductionHardeningV8MegaPack4StatusController,
  ProductionHardeningV8MegaPack4VerificationController,
  RuntimeAutonomousApprovalController,
  RuntimeAutonomousRecoveryController,
  RuntimeCapacityGovernanceController,
  RuntimeCascadingFailureController,
  RuntimeChangeExecutionController,
  RuntimeChangeWindowController,
  RuntimeDecisionCenterController,
  RuntimeDependencyGraphController,
  RuntimeExecutionEvidenceController,
  RuntimeExecutionLockController,
  RuntimeGovernanceApprovalMatrixController,
  RuntimeGovernanceArchiveController,
  RuntimeGovernanceAuditController,
  RuntimeGovernanceCheckpointController,
  RuntimeGovernanceControlModeController,
  RuntimeGovernanceDashboardController,
  RuntimeGovernanceDataLifecycleController,
  RuntimeGovernanceEscalationController,
  RuntimeGovernanceEvaluationController,
  RuntimeGovernanceImpactController,
  RuntimeGovernanceNotificationController,
  RuntimeGovernanceOperationsController,
  RuntimeGovernanceRecommendationController,
  RuntimeGovernanceRequestController,
  RuntimeGovernanceRestoreController,
  RuntimeGovernanceRetentionController,
  RuntimeGovernanceSchedulerController,
  RuntimeGovernanceSimulationController,
  RuntimeMaintenanceModeController,
  RuntimeOperationalGuardrailController,
  RuntimeRunbookController,
  RuntimeServiceIsolationController,
  RuntimeSloController,
} from "./controllers";

import {
  ProductionHardeningV8MegaPack4StatusService,
  RuntimeAutonomousApprovalService,
  RuntimeAutonomousRecoveryService,
  RuntimeCapacityGovernanceService,
  RuntimeCascadingFailureService,
  RuntimeChangeExecutionService,
  RuntimeChangeWindowService,
  RuntimeDecisionCenterService,
  RuntimeDependencyGraphService,
  RuntimeExecutionEvidenceService,
  RuntimeExecutionLockService,
  RuntimeExecutionStatusService,
  RuntimeGovernanceApprovalMatrixService,
  RuntimeGovernanceArchiveService,
  RuntimeGovernanceAuditService,
  RuntimeGovernanceCheckpointService,
  RuntimeGovernanceControlModeService,
  RuntimeGovernanceDashboardService,
  RuntimeGovernanceDataLifecycleStatusService,
  RuntimeGovernanceEscalationService,
  RuntimeGovernanceEvaluationService,
  RuntimeGovernanceImpactService,
  RuntimeGovernanceNotificationService,
  RuntimeGovernanceOperationsStatusService,
  RuntimeGovernanceRecommendationService,
  RuntimeGovernanceRequestService,
  RuntimeGovernanceRestoreService,
  RuntimeGovernanceRetentionService,
  RuntimeGovernanceSchedulerService,
  RuntimeGovernanceSimulationService,
  RuntimeGovernanceSnapshotBuilderService,
  RuntimeGovernanceTimelineService,
  RuntimeGuardrailEvaluatorService,
  RuntimeMaintenanceModeService,
  RuntimeOperationalGuardrailService,
  RuntimeRunbookService,
  RuntimeServiceIsolationService,
  RuntimeSloService,
} from "./services";

import {
  RuntimeRunbookStepExecutor,
} from "./executors";

import {
  RuntimeGovernanceStore,
} from "./stores/runtime-governance.store";

import {
  ProductionHardeningV8MegaPack4VerificationService,
} from "./verification/production-hardening-v8-mega-pack-4-verification.service";

const controllers = [
  ProductionHardeningV8MegaPack4StatusController,
  ProductionHardeningV8MegaPack4VerificationController,

  RuntimeGovernanceControlModeController,
  RuntimeGovernanceAuditController,
  RuntimeChangeWindowController,
  RuntimeMaintenanceModeController,
  RuntimeGovernanceRequestController,
  RuntimeDependencyGraphController,
  RuntimeCascadingFailureController,
  RuntimeSloController,
  RuntimeGovernanceEvaluationController,
  RuntimeGovernanceRecommendationController,
  RuntimeGovernanceSimulationController,
  RuntimeGovernanceImpactController,
  RuntimeGovernanceApprovalMatrixController,
  RuntimeGovernanceDashboardController,

  RuntimeAutonomousRecoveryController,
  RuntimeServiceIsolationController,
  RuntimeCapacityGovernanceController,

  RuntimeDecisionCenterController,
  RuntimeAutonomousApprovalController,
  RuntimeOperationalGuardrailController,

  RuntimeRunbookController,
  RuntimeChangeExecutionController,
  RuntimeExecutionLockController,
  RuntimeExecutionEvidenceController,

  RuntimeGovernanceSchedulerController,
  RuntimeGovernanceEscalationController,
  RuntimeGovernanceNotificationController,
  RuntimeGovernanceOperationsController,

  RuntimeGovernanceCheckpointController,
  RuntimeGovernanceRetentionController,
  RuntimeGovernanceArchiveController,
  RuntimeGovernanceRestoreController,
  RuntimeGovernanceDataLifecycleController,
];

const providers = [
  RuntimeGovernanceStore,

  RuntimeGovernanceAuditService,
  RuntimeGovernanceControlModeService,
  RuntimeChangeWindowService,
  RuntimeMaintenanceModeService,
  RuntimeGovernanceRequestService,
  RuntimeDependencyGraphService,
  RuntimeCascadingFailureService,
  RuntimeSloService,
  RuntimeGovernanceRecommendationService,
  RuntimeGovernanceEvaluationService,
  RuntimeGovernanceSimulationService,
  RuntimeGovernanceImpactService,
  RuntimeGovernanceApprovalMatrixService,
  RuntimeGovernanceDashboardService,

  RuntimeAutonomousRecoveryService,
  RuntimeServiceIsolationService,
  RuntimeCapacityGovernanceService,

  RuntimeGuardrailEvaluatorService,
  RuntimeOperationalGuardrailService,
  RuntimeAutonomousApprovalService,
  RuntimeDecisionCenterService,

  RuntimeExecutionEvidenceService,
  RuntimeExecutionLockService,
  RuntimeRunbookStepExecutor,
  RuntimeRunbookService,
  RuntimeChangeExecutionService,
  RuntimeExecutionStatusService,

  RuntimeGovernanceTimelineService,
  RuntimeGovernanceNotificationService,
  RuntimeGovernanceEscalationService,
  RuntimeGovernanceSchedulerService,
  RuntimeGovernanceOperationsStatusService,

  RuntimeGovernanceSnapshotBuilderService,
  RuntimeGovernanceCheckpointService,
  RuntimeGovernanceRetentionService,
  RuntimeGovernanceArchiveService,
  RuntimeGovernanceRestoreService,
  RuntimeGovernanceDataLifecycleStatusService,

  ProductionHardeningV8MegaPack4StatusService,
  ProductionHardeningV8MegaPack4VerificationService,
  ProductionHardeningV8MegaPack4Bootstrap,
];

@Module({
  controllers,
  providers,
  exports: providers,
})
export class ProductionHardeningV8MegaPack4Module {}
