import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommercePlatformService } from "./commerce-platform.service";
import { CommercePlatformExecutionRequest } from "./commerce-platform.types";

@Controller("galaxy-platform/commerce-platform")
export class CommercePlatformController {
  constructor(private readonly service: CommercePlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: CommercePlatformExecutionRequest) {
    return this.service.execute(request);
  }
}