import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain068Service } from "./galaxy-2-domain-068.service";
import { Galaxy2Domain068ExecutionRequest } from "./galaxy-2-domain-068.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-068")
export class Galaxy2Domain068Controller {
  constructor(private readonly service: Galaxy2Domain068Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain068ExecutionRequest) {
    return this.service.execute(request);
  }
}