import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain041Service } from "./galaxy-2-domain-041.service";
import { Galaxy2Domain041ExecutionRequest } from "./galaxy-2-domain-041.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-041")
export class Galaxy2Domain041Controller {
  constructor(private readonly service: Galaxy2Domain041Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain041ExecutionRequest) {
    return this.service.execute(request);
  }
}