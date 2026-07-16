import { Module } from "@nestjs/common";
import { AdvancedTwinRegistryService } from "./advanced-twin-registry.service";
import { EnterpriseAdvancedDigitalTwinPlatformController } from "./enterprise-advanced-digital-twin-platform.controller";
import { EnterpriseAdvancedDigitalTwinPlatformService } from "./enterprise-advanced-digital-twin-platform.service";
import { TwinInsightEngineService } from "./twin-insight-engine.service";
import { TwinScenarioLaboratoryService } from "./twin-scenario-laboratory.service";
import { TwinStateSynchronizationService } from "./twin-state-synchronization.service";

@Module({
  controllers: [EnterpriseAdvancedDigitalTwinPlatformController],
  providers: [
    AdvancedTwinRegistryService,
    EnterpriseAdvancedDigitalTwinPlatformService,
    TwinInsightEngineService,
    TwinScenarioLaboratoryService,
    TwinStateSynchronizationService,
  ],
  exports: [
    AdvancedTwinRegistryService,
    EnterpriseAdvancedDigitalTwinPlatformService,
    TwinInsightEngineService,
    TwinScenarioLaboratoryService,
    TwinStateSynchronizationService,
  ],
})
export class EnterpriseAdvancedDigitalTwinPlatformModule {}
