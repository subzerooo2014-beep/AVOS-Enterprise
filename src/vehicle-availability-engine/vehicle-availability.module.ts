import { Module } from "@nestjs/common";
import { VehicleAvailabilityService } from "./vehicle-availability.service";

@Module({
  providers:[VehicleAvailabilityService],
  exports:[VehicleAvailabilityService],
})
export class VehicleAvailabilityModule {}
