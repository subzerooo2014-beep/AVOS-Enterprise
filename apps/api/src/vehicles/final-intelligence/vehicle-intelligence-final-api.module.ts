import { Module } from "@nestjs/common";
import { VehicleIntelligenceFinalModule } from "./vehicle-intelligence-final.module";
import { VehicleIntelligenceFinalController } from "./vehicle-intelligence-final.controller";

@Module({
  imports: [VehicleIntelligenceFinalModule],
  controllers: [VehicleIntelligenceFinalController],
  exports: [VehicleIntelligenceFinalModule],
})
export class VehicleIntelligenceFinalApiModule {}
