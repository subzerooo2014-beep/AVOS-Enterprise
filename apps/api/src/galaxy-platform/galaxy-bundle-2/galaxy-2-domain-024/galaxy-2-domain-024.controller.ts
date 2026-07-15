import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain024Service } from "./galaxy-2-domain-024.service";
import { Galaxy2Domain024ExecutionRequest } from "./galaxy-2-domain-024.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-024")
export class Galaxy2Domain024Controller {
  constructor(private readonly service: Galaxy2Domain024Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain024ExecutionRequest) {
    return this.service.execute(request);
  }
}