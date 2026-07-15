import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain094Service } from "./galaxy-2-domain-094.service";
import { Galaxy2Domain094ExecutionRequest } from "./galaxy-2-domain-094.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-094")
export class Galaxy2Domain094Controller {
  constructor(private readonly service: Galaxy2Domain094Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain094ExecutionRequest) {
    return this.service.execute(request);
  }
}