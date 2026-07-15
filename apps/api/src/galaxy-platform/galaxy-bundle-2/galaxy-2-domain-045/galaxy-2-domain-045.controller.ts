import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain045Service } from "./galaxy-2-domain-045.service";
import { Galaxy2Domain045ExecutionRequest } from "./galaxy-2-domain-045.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-045")
export class Galaxy2Domain045Controller {
  constructor(private readonly service: Galaxy2Domain045Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain045ExecutionRequest) {
    return this.service.execute(request);
  }
}