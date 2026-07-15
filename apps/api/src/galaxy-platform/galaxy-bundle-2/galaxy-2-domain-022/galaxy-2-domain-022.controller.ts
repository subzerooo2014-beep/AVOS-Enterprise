import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain022Service } from "./galaxy-2-domain-022.service";
import { Galaxy2Domain022ExecutionRequest } from "./galaxy-2-domain-022.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-022")
export class Galaxy2Domain022Controller {
  constructor(private readonly service: Galaxy2Domain022Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain022ExecutionRequest) {
    return this.service.execute(request);
  }
}