import { Body, Controller, Get, Post } from "@nestjs/common";
import { CompliancePlatformService } from "./compliance-platform.service";
import { CompliancePlatformExecutionRequest } from "./compliance-platform.types";

@Controller("galaxy-platform/compliance-platform")
export class CompliancePlatformController {
  constructor(private readonly service: CompliancePlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: CompliancePlatformExecutionRequest) {
    return this.service.execute(request);
  }
}