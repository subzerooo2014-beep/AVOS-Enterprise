import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain039Service } from "./galaxy-2-domain-039.service";
import { Galaxy2Domain039ExecutionRequest } from "./galaxy-2-domain-039.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-039")
export class Galaxy2Domain039Controller {
  constructor(private readonly service: Galaxy2Domain039Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain039ExecutionRequest) {
    return this.service.execute(request);
  }
}