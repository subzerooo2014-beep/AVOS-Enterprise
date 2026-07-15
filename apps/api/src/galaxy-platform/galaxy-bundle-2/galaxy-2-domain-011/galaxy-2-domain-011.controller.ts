import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain011Service } from "./galaxy-2-domain-011.service";
import { Galaxy2Domain011ExecutionRequest } from "./galaxy-2-domain-011.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-011")
export class Galaxy2Domain011Controller {
  constructor(private readonly service: Galaxy2Domain011Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain011ExecutionRequest) {
    return this.service.execute(request);
  }
}