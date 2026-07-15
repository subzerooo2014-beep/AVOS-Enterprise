import { Body, Controller, Get, Post } from "@nestjs/common";
import { InsurancePlatformService } from "./insurance-platform.service";
import { InsurancePlatformExecutionRequest } from "./insurance-platform.types";

@Controller("galaxy-platform/insurance-platform")
export class InsurancePlatformController {
  constructor(private readonly service: InsurancePlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: InsurancePlatformExecutionRequest) {
    return this.service.execute(request);
  }
}