import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain009Service } from "./galaxy-2-domain-009.service";
import { Galaxy2Domain009ExecutionRequest } from "./galaxy-2-domain-009.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-009")
export class Galaxy2Domain009Controller {
  constructor(private readonly service: Galaxy2Domain009Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain009ExecutionRequest) {
    return this.service.execute(request);
  }
}