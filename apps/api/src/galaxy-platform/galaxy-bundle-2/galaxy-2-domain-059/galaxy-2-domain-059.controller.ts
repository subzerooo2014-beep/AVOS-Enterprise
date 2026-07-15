import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain059Service } from "./galaxy-2-domain-059.service";
import { Galaxy2Domain059ExecutionRequest } from "./galaxy-2-domain-059.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-059")
export class Galaxy2Domain059Controller {
  constructor(private readonly service: Galaxy2Domain059Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain059ExecutionRequest) {
    return this.service.execute(request);
  }
}