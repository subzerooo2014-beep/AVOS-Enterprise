import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain080Service } from "./galaxy-2-domain-080.service";
import { Galaxy2Domain080ExecutionRequest } from "./galaxy-2-domain-080.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-080")
export class Galaxy2Domain080Controller {
  constructor(private readonly service: Galaxy2Domain080Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain080ExecutionRequest) {
    return this.service.execute(request);
  }
}