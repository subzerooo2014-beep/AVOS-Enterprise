import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain075Service } from "./galaxy-2-domain-075.service";
import { Galaxy2Domain075ExecutionRequest } from "./galaxy-2-domain-075.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-075")
export class Galaxy2Domain075Controller {
  constructor(private readonly service: Galaxy2Domain075Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain075ExecutionRequest) {
    return this.service.execute(request);
  }
}