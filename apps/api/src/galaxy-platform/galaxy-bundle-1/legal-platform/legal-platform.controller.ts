import { Body, Controller, Get, Post } from "@nestjs/common";
import { LegalPlatformService } from "./legal-platform.service";
import { LegalPlatformExecutionRequest } from "./legal-platform.types";

@Controller("galaxy-platform/legal-platform")
export class LegalPlatformController {
  constructor(private readonly service: LegalPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: LegalPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}