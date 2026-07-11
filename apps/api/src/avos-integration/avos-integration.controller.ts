import { Body, Controller, Get, Post } from "@nestjs/common";
import { AvosIntegrationService } from "./avos-integration.service";

@Controller("avos-integration")
export class AvosIntegrationController {
  constructor(private service: AvosIntegrationService) {}

  @Post("vehicle-created")
  vehicleCreated(@Body() body: any) {
    return this.service.vehicleCreated(body);
  }

  @Get("runs")
  listRuns() {
    return this.service.listRuns();
  }
}
