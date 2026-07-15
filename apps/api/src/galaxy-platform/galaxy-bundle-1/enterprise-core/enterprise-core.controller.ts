import { Body, Controller, Get, Post } from "@nestjs/common";
import { EnterpriseCoreService } from "./enterprise-core.service";
import { EnterpriseCoreExecutionRequest } from "./enterprise-core.types";

@Controller("galaxy-platform/enterprise-core")
export class EnterpriseCoreController {
  constructor(private readonly service: EnterpriseCoreService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: EnterpriseCoreExecutionRequest) {
    return this.service.execute(request);
  }
}