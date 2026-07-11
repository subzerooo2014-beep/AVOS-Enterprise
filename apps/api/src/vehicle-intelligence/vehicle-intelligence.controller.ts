import { Body, Controller, Get, Post } from "@nestjs/common";
import { VehicleIntelligenceService } from "./vehicle-intelligence.service";

@Controller("vehicle-intelligence")
export class VehicleIntelligenceController {
  constructor(private service: VehicleIntelligenceService) {}

  @Post("valuation")
  valueVehicle(@Body() body: any) {
    return this.service.valueVehicle(body);
  }

  @Get("valuations")
  list() {
    return this.service.listValuations();
  }
}
