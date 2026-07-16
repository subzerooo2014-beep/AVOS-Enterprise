import { Module } from "@nestjs/common";
import { EnterpriseDigitalTwinOperationsPlatformController } from "./enterprise-digital-twin-operations-platform.controller";
import { EnterpriseDigitalTwinOperationsPlatformService } from "./enterprise-digital-twin-operations-platform.service";
import { LiveStateSynchronizationService } from "./live-state-synchronization.service";
import { OperationalTwinRegistryService } from "./operational-twin-registry.service";
import { PredictiveTwinAnalyticsService } from "./predictive-twin-analytics.service";
import { ScenarioReplayEngineService } from "./scenario-replay-engine.service";
import { TwinHealthMonitorService } from "./twin-health-monitor.service";

@Module({
  controllers: [EnterpriseDigitalTwinOperationsPlatformController],
  providers: [
    EnterpriseDigitalTwinOperationsPlatformService,
    LiveStateSynchronizationService,
    OperationalTwinRegistryService,
    PredictiveTwinAnalyticsService,
    ScenarioReplayEngineService,
    TwinHealthMonitorService,
  ],
  exports: [
    EnterpriseDigitalTwinOperationsPlatformService,
    LiveStateSynchronizationService,
    OperationalTwinRegistryService,
    PredictiveTwinAnalyticsService,
    ScenarioReplayEngineService,
    TwinHealthMonitorService,
  ],
})
export class EnterpriseDigitalTwinOperationsPlatformModule {}
