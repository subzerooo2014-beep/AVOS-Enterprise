import { Module } from "@nestjs/common";
import { VehicleLifecycleIntegrationModule } from "../lifecycle-integration/vehicle-lifecycle-integration.module";
import { VehicleIntelligencePersistenceModule } from "../prisma-intelligence/vehicle-intelligence-persistence.module";
import { VehicleLifecyclePrismaController } from "./vehicle-lifecycle-prisma.controller";
import { VehicleLifecyclePrismaOrchestratorService } from "./vehicle-lifecycle-prisma-orchestrator.service";

@Module({
  imports: [
    VehicleLifecycleIntegrationModule,
    VehicleIntelligencePersistenceModule,
  ],
  controllers: [VehicleLifecyclePrismaController],
  providers: [VehicleLifecyclePrismaOrchestratorService],
  exports: [VehicleLifecyclePrismaOrchestratorService],
})
export class VehicleLifecyclePrismaIntegrationModule {}
