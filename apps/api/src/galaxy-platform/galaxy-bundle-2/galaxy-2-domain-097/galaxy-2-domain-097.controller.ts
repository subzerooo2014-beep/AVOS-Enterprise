import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain097Service } from "./galaxy-2-domain-097.service";
import { Galaxy2Domain097ExecutionRequest } from "./galaxy-2-domain-097.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-097")
export class Galaxy2Domain097Controller {
  constructor(private readonly service: Galaxy2Domain097Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain097ExecutionRequest) {
    return this.service.execute(request);
  }
}