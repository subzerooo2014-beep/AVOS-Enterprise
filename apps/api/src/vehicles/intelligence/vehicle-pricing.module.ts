import { Module } from "@nestjs/common";
import { VehiclePricingAiService } from "./vehicle-pricing-ai.service";

@Module({
  providers:[VehiclePricingAiService],
  exports:[VehiclePricingAiService],
})
export class VehiclePricingModule {}
