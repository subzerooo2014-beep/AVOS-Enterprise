import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain004Service } from "./galaxy-2-domain-004.service";
import { Galaxy2Domain004ExecutionRequest } from "./galaxy-2-domain-004.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-004")
export class Galaxy2Domain004Controller {
  constructor(private readonly service: Galaxy2Domain004Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain004ExecutionRequest) {
    return this.service.execute(request);
  }
}