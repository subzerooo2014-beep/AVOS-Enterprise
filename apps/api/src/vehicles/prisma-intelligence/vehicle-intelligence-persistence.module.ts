import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { VehicleIntelligencePersistenceController } from "./vehicle-intelligence-persistence.controller";
import { VehicleIntelligencePersistenceService } from "./vehicle-intelligence-persistence.service";

@Module({
  imports: [PrismaModule],
  controllers: [VehicleIntelligencePersistenceController],
  providers: [VehicleIntelligencePersistenceService],
  exports: [VehicleIntelligencePersistenceService],
})
export class VehicleIntelligencePersistenceModule {}
