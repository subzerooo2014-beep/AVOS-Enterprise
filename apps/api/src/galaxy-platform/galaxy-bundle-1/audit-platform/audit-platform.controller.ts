import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuditPlatformService } from "./audit-platform.service";
import { AuditPlatformExecutionRequest } from "./audit-platform.types";

@Controller("galaxy-platform/audit-platform")
export class AuditPlatformController {
  constructor(private readonly service: AuditPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: AuditPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}