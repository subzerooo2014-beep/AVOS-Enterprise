import { Body, Controller, Get, Post } from "@nestjs/common";
import { MarketplacePlatformService } from "./marketplace-platform.service";
import { MarketplacePlatformExecutionRequest } from "./marketplace-platform.types";

@Controller("galaxy-platform/marketplace-platform")
export class MarketplacePlatformController {
  constructor(private readonly service: MarketplacePlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: MarketplacePlatformExecutionRequest) {
    return this.service.execute(request);
  }
}