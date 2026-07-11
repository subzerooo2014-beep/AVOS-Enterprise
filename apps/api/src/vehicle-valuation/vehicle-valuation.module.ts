import { Module } from "@nestjs/common";
import { VehicleValuationController } from "./vehicle-valuation.controller";
import { VehicleValuationService } from "./vehicle-valuation.service";

@Module({
  controllers: [VehicleValuationController],
  providers: [VehicleValuationService],
})
export class VehicleValuationModule {}
