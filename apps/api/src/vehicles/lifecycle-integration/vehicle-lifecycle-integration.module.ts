import { Module } from "@nestjs/common";
import { VehicleBrainIntegrationModule } from "../brain-integration/vehicle-brain-integration.module";
import { VehicleIntelligenceFinalModule } from "../final-intelligence/vehicle-intelligence-final.module";
import { VehicleLifecycleController } from "./vehicle-lifecycle.controller";
import { VehicleLifecycleOrchestratorService } from "./vehicle-lifecycle-orchestrator.service";
import { VehicleLifecycleStoreService } from "./vehicle-lifecycle-store.service";

@Module({
  imports: [
    VehicleBrainIntegrationModule,
    VehicleIntelligenceFinalModule,
  ],
  controllers: [VehicleLifecycleController],
  providers: [
    VehicleLifecycleStoreService,
    VehicleLifecycleOrchestratorService,
  ],
  exports: [
    VehicleLifecycleStoreService,
    VehicleLifecycleOrchestratorService,
  ],
})
export class VehicleLifecycleIntegrationModule {}
