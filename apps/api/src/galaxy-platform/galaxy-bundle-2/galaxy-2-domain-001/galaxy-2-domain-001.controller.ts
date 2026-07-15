import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain001Service } from "./galaxy-2-domain-001.service";
import { Galaxy2Domain001ExecutionRequest } from "./galaxy-2-domain-001.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-001")
export class Galaxy2Domain001Controller {
  constructor(private readonly service: Galaxy2Domain001Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain001ExecutionRequest) {
    return this.service.execute(request);
  }
}