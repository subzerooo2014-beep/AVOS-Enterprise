"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV8MegaPack4Module = void 0;
const common_1 = require("@nestjs/common");
const production_hardening_v8_mega_pack_4_bootstrap_1 = require("./bootstrap/production-hardening-v8-mega-pack-4.bootstrap");
const controllers_1 = require("./controllers");
const services_1 = require("./services");
const executors_1 = require("./executors");
const runtime_governance_store_1 = require("./stores/runtime-governance.store");
const production_hardening_v8_mega_pack_4_verification_service_1 = require("./verification/production-hardening-v8-mega-pack-4-verification.service");
const controllers = [
    controllers_1.ProductionHardeningV8MegaPack4StatusController,
    controllers_1.ProductionHardeningV8MegaPack4VerificationController,
    controllers_1.RuntimeGovernanceControlModeController,
    controllers_1.RuntimeGovernanceAuditController,
    controllers_1.RuntimeChangeWindowController,
    controllers_1.RuntimeMaintenanceModeController,
    controllers_1.RuntimeGovernanceRequestController,
    controllers_1.RuntimeDependencyGraphController,
    controllers_1.RuntimeCascadingFailureController,
    controllers_1.RuntimeSloController,
    controllers_1.RuntimeGovernanceEvaluationController,
    controllers_1.RuntimeGovernanceRecommendationController,
    controllers_1.RuntimeGovernanceSimulationController,
    controllers_1.RuntimeGovernanceImpactController,
    controllers_1.RuntimeGovernanceApprovalMatrixController,
    controllers_1.RuntimeGovernanceDashboardController,
    controllers_1.RuntimeAutonomousRecoveryController,
    controllers_1.RuntimeServiceIsolationController,
    controllers_1.RuntimeCapacityGovernanceController,
    controllers_1.RuntimeDecisionCenterController,
    controllers_1.RuntimeAutonomousApprovalController,
    controllers_1.RuntimeOperationalGuardrailController,
    controllers_1.RuntimeRunbookController,
    controllers_1.RuntimeChangeExecutionController,
    controllers_1.RuntimeExecutionLockController,
    controllers_1.RuntimeExecutionEvidenceController,
    controllers_1.RuntimeGovernanceSchedulerController,
    controllers_1.RuntimeGovernanceEscalationController,
    controllers_1.RuntimeGovernanceNotificationController,
    controllers_1.RuntimeGovernanceOperationsController,
    controllers_1.RuntimeGovernanceCheckpointController,
    controllers_1.RuntimeGovernanceRetentionController,
    controllers_1.RuntimeGovernanceArchiveController,
    controllers_1.RuntimeGovernanceRestoreController,
    controllers_1.RuntimeGovernanceDataLifecycleController,
];
const providers = [
    runtime_governance_store_1.RuntimeGovernanceStore,
    services_1.RuntimeGovernanceAuditService,
    services_1.RuntimeGovernanceControlModeService,
    services_1.RuntimeChangeWindowService,
    services_1.RuntimeMaintenanceModeService,
    services_1.RuntimeGovernanceRequestService,
    services_1.RuntimeDependencyGraphService,
    services_1.RuntimeCascadingFailureService,
    services_1.RuntimeSloService,
    services_1.RuntimeGovernanceRecommendationService,
    services_1.RuntimeGovernanceEvaluationService,
    services_1.RuntimeGovernanceSimulationService,
    services_1.RuntimeGovernanceImpactService,
    services_1.RuntimeGovernanceApprovalMatrixService,
    services_1.RuntimeGovernanceDashboardService,
    services_1.RuntimeAutonomousRecoveryService,
    services_1.RuntimeServiceIsolationService,
    services_1.RuntimeCapacityGovernanceService,
    services_1.RuntimeGuardrailEvaluatorService,
    services_1.RuntimeOperationalGuardrailService,
    services_1.RuntimeAutonomousApprovalService,
    services_1.RuntimeDecisionCenterService,
    services_1.RuntimeExecutionEvidenceService,
    services_1.RuntimeExecutionLockService,
    executors_1.RuntimeRunbookStepExecutor,
    services_1.RuntimeRunbookService,
    services_1.RuntimeChangeExecutionService,
    services_1.RuntimeExecutionStatusService,
    services_1.RuntimeGovernanceTimelineService,
    services_1.RuntimeGovernanceNotificationService,
    services_1.RuntimeGovernanceEscalationService,
    services_1.RuntimeGovernanceSchedulerService,
    services_1.RuntimeGovernanceOperationsStatusService,
    services_1.RuntimeGovernanceSnapshotBuilderService,
    services_1.RuntimeGovernanceCheckpointService,
    services_1.RuntimeGovernanceRetentionService,
    services_1.RuntimeGovernanceArchiveService,
    services_1.RuntimeGovernanceRestoreService,
    services_1.RuntimeGovernanceDataLifecycleStatusService,
    services_1.ProductionHardeningV8MegaPack4StatusService,
    production_hardening_v8_mega_pack_4_verification_service_1.ProductionHardeningV8MegaPack4VerificationService,
    production_hardening_v8_mega_pack_4_bootstrap_1.ProductionHardeningV8MegaPack4Bootstrap,
];
let ProductionHardeningV8MegaPack4Module = class ProductionHardeningV8MegaPack4Module {
};
exports.ProductionHardeningV8MegaPack4Module = ProductionHardeningV8MegaPack4Module;
exports.ProductionHardeningV8MegaPack4Module = ProductionHardeningV8MegaPack4Module = __decorate([
    (0, common_1.Module)({
        controllers,
        providers,
        exports: providers,
    })
], ProductionHardeningV8MegaPack4Module);
//# sourceMappingURL=production-hardening-v8-mega-pack-4.module.js.map