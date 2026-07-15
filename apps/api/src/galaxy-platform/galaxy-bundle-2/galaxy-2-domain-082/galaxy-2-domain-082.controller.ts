import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain082Service } from "./galaxy-2-domain-082.service";
import { Galaxy2Domain082ExecutionRequest } from "./galaxy-2-domain-082.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-082")
export class Galaxy2Domain082Controller {
  constructor(private readonly service: Galaxy2Domain082Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain082ExecutionRequest) {
    return this.service.execute(request);
  }
}