import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain040Service } from "./galaxy-2-domain-040.service";
import { Galaxy2Domain040ExecutionRequest } from "./galaxy-2-domain-040.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-040")
export class Galaxy2Domain040Controller {
  constructor(private readonly service: Galaxy2Domain040Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain040ExecutionRequest) {
    return this.service.execute(request);
  }
}