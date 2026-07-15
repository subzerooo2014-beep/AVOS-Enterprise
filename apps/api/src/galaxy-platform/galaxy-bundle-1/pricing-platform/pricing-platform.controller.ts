import { Body, Controller, Get, Post } from "@nestjs/common";
import { PricingPlatformService } from "./pricing-platform.service";
import { PricingPlatformExecutionRequest } from "./pricing-platform.types";

@Controller("galaxy-platform/pricing-platform")
export class PricingPlatformController {
  constructor(private readonly service: PricingPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: PricingPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}