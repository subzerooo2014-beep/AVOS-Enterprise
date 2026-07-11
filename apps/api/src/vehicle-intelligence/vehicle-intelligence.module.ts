import { Module } from "@nestjs/common";
import { VehicleIntelligenceController } from "./vehicle-intelligence.controller";
import { VehicleIntelligenceService } from "./vehicle-intelligence.service";

@Module({
  controllers: [VehicleIntelligenceController],
  providers: [VehicleIntelligenceService],
  exports: [VehicleIntelligenceService],
})
export class VehicleIntelligenceModule {}
