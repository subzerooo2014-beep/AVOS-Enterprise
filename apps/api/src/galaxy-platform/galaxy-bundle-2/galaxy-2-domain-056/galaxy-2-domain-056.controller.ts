import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain056Service } from "./galaxy-2-domain-056.service";
import { Galaxy2Domain056ExecutionRequest } from "./galaxy-2-domain-056.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-056")
export class Galaxy2Domain056Controller {
  constructor(private readonly service: Galaxy2Domain056Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain056ExecutionRequest) {
    return this.service.execute(request);
  }
}