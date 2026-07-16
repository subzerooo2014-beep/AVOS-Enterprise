import { Module } from "@nestjs/common";
import { AiOperationsOrchestratorService } from "./ai-operations-orchestrator.service";
import { AutonomousIncidentManagerService } from "./autonomous-incident-manager.service";
import { EnterpriseAutonomousOperationsPlatformController } from "./enterprise-autonomous-operations-platform.controller";
import { EnterpriseAutonomousOperationsPlatformService } from "./enterprise-autonomous-operations-platform.service";
import { OperationsSignalCenterService } from "./operations-signal-center.service";
import { PredictiveOperationsService } from "./predictive-operations.service";
import { SelfHealingEngineService } from "./self-healing-engine.service";

@Module({
  controllers: [EnterpriseAutonomousOperationsPlatformController],
  providers: [
    AiOperationsOrchestratorService,
    AutonomousIncidentManagerService,
    EnterpriseAutonomousOperationsPlatformService,
    OperationsSignalCenterService,
    PredictiveOperationsService,
    SelfHealingEngineService,
  ],
  exports: [
    AiOperationsOrchestratorService,
    AutonomousIncidentManagerService,
    EnterpriseAutonomousOperationsPlatformService,
    OperationsSignalCenterService,
    PredictiveOperationsService,
    SelfHealingEngineService,
  ],
})
export class EnterpriseAutonomousOperationsPlatformModule {}
