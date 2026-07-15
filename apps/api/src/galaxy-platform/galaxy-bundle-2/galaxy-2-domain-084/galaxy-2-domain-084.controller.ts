import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain084Service } from "./galaxy-2-domain-084.service";
import { Galaxy2Domain084ExecutionRequest } from "./galaxy-2-domain-084.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-084")
export class Galaxy2Domain084Controller {
  constructor(private readonly service: Galaxy2Domain084Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain084ExecutionRequest) {
    return this.service.execute(request);
  }
}