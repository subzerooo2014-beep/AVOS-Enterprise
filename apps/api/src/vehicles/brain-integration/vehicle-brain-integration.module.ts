import { Module } from "@nestjs/common";
import { VehicleIntelligenceFinalModule } from "../final-intelligence/vehicle-intelligence-final.module";
import { VehicleBrainIntegrationQueueService } from "./vehicle-brain-integration-queue.service";
import { VehicleBrainIntegrationOrchestratorService } from "./vehicle-brain-integration-orchestrator.service";
import { VehicleBrainIntegrationController } from "./vehicle-brain-integration.controller";

@Module({
  imports: [VehicleIntelligenceFinalModule],
  controllers: [VehicleBrainIntegrationController],
  providers: [
    VehicleBrainIntegrationQueueService,
    VehicleBrainIntegrationOrchestratorService,
  ],
  exports: [
    VehicleBrainIntegrationQueueService,
    VehicleBrainIntegrationOrchestratorService,
  ],
})
export class VehicleBrainIntegrationModule {}
