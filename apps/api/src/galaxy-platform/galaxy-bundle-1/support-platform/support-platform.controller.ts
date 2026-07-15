import { Body, Controller, Get, Post } from "@nestjs/common";
import { SupportPlatformService } from "./support-platform.service";
import { SupportPlatformExecutionRequest } from "./support-platform.types";

@Controller("galaxy-platform/support-platform")
export class SupportPlatformController {
  constructor(private readonly service: SupportPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: SupportPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}