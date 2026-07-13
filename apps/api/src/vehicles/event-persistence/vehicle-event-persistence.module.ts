import { Module } from "@nestjs/common";
import { VehicleLifecyclePrismaIntegrationModule } from "../lifecycle-prisma-integration/vehicle-lifecycle-prisma-integration.module";
import { VehicleEventPersistenceController } from "./vehicle-event-persistence.controller";
import { VehicleEventPersistenceStoreService } from "./vehicle-event-persistence-store.service";
import { VehicleEventProcessingService } from "./vehicle-event-processing.service";

@Module({
  imports: [VehicleLifecyclePrismaIntegrationModule],
  controllers: [VehicleEventPersistenceController],
  providers: [
    VehicleEventPersistenceStoreService,
    VehicleEventProcessingService,
  ],
  exports: [
    VehicleEventPersistenceStoreService,
    VehicleEventProcessingService,
  ],
})
export class VehicleEventPersistenceModule {}
