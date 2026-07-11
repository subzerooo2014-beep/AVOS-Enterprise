import { Body, Controller, Post } from "@nestjs/common";
import { VehicleValuationService } from "./vehicle-valuation.service";
import { ValuateVehicleDto } from "./dto/valuate-vehicle.dto";

@Controller("vehicle-valuation")
export class VehicleValuationController {
  constructor(private service: VehicleValuationService) {}

  @Post()
  valuate(@Body() dto: ValuateVehicleDto) {
    return this.service.valuate(dto);
  }
}
