import { Module } from "@nestjs/common";
import { EnterpriseAutonomousDecisionService } from "./enterprise-autonomous-decision.service";
import { EnterpriseDecisionOrchestratorService } from "./enterprise-decision-orchestrator.service";
import { EnterpriseE8Controller } from "./enterprise-e8.controller";
import { EnterpriseE8OrchestratorService } from "./enterprise-e8-orchestrator.service";
import { EnterprisePolicyGuardService } from "./enterprise-policy-guard.service";
import { EnterpriseResilienceEngineService } from "./enterprise-resilience-engine.service";
import { EnterpriseScenarioSimulatorService } from "./enterprise-scenario-simulator.service";
import { EnterpriseSignalDetectionService } from "./enterprise-signal-detection.service";

@Module({
  controllers: [EnterpriseE8Controller],
  providers: [
    EnterpriseSignalDetectionService,
    EnterpriseScenarioSimulatorService,
    EnterpriseResilienceEngineService,
    EnterpriseAutonomousDecisionService,
    EnterprisePolicyGuardService,
    EnterpriseDecisionOrchestratorService,
    EnterpriseE8OrchestratorService,
  ],
  exports: [
    EnterpriseSignalDetectionService,
    EnterpriseScenarioSimulatorService,
    EnterpriseResilienceEngineService,
    EnterpriseAutonomousDecisionService,
    EnterprisePolicyGuardService,
    EnterpriseDecisionOrchestratorService,
    EnterpriseE8OrchestratorService,
  ],
})
export class EnterpriseE8Module {}