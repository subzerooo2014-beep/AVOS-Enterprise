import { Module } from "@nestjs/common";

import {
  ResilienceActionController,
  ResilienceConfigurationController,
  ResiliencePolicyController,
  RuntimeBaselineController,
  RuntimeControlModeController,
  RuntimeEvidenceController,
  RuntimeIncidentController,
  RuntimeResilienceStatusController,
  RuntimeResilienceVerificationController,
  RuntimeRiskEvaluationController,
  RuntimeSignalController,
} from "./controllers";

import {
  ResilienceActionService,
  ResilienceConfigurationService,
  ResiliencePolicyEvaluatorService,
  ResiliencePolicyService,
  RuntimeBaselineService,
  RuntimeControlModeService,
  RuntimeEvidenceChainService,
  RuntimeIncidentService,
  RuntimeResilienceStatusService,
  RuntimeRiskEvaluationService,
  RuntimeSignalService,
} from "./services";

import {
  ResilienceActionExecutorRegistry,
  SafeResilienceActionExecutor,
} from "./executors";

import { RuntimeResilienceStore } from "./stores/runtime-resilience.store";
import { RuntimeResilienceBootstrapService } from "./bootstrap/runtime-resilience-bootstrap.service";
import { RuntimeResilienceVerificationService } from "./verification/runtime-resilience-verification.service";

@Module({
  controllers: [
    ResilienceConfigurationController,
    ResiliencePolicyController,
    RuntimeRiskEvaluationController,
    RuntimeControlModeController,
    RuntimeSignalController,
    RuntimeIncidentController,
    ResilienceActionController,
    RuntimeBaselineController,
    RuntimeEvidenceController,
    RuntimeResilienceStatusController,
    RuntimeResilienceVerificationController,
  ],
  providers: [
    RuntimeResilienceStore,
    RuntimeEvidenceChainService,
    ResilienceConfigurationService,
    ResiliencePolicyService,
    ResiliencePolicyEvaluatorService,
    RuntimeRiskEvaluationService,
    RuntimeControlModeService,
    RuntimeSignalService,
    RuntimeIncidentService,
    RuntimeBaselineService,
    SafeResilienceActionExecutor,
    ResilienceActionExecutorRegistry,
    ResilienceActionService,
    RuntimeResilienceStatusService,
    RuntimeResilienceBootstrapService,
    RuntimeResilienceVerificationService,
  ],
  exports: [
    RuntimeResilienceStore,
    RuntimeEvidenceChainService,
    ResilienceConfigurationService,
    ResiliencePolicyService,
    RuntimeRiskEvaluationService,
    RuntimeSignalService,
    RuntimeIncidentService,
    ResilienceActionService,
    RuntimeBaselineService,
    RuntimeControlModeService,
    RuntimeResilienceStatusService,
    RuntimeResilienceVerificationService,
  ],
})
export class ProductionHardeningV8MegaPack3Module {}
