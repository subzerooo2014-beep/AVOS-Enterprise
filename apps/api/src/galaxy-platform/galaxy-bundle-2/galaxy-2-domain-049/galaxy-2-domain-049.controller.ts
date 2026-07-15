import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain049Service } from "./galaxy-2-domain-049.service";
import { Galaxy2Domain049ExecutionRequest } from "./galaxy-2-domain-049.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-049")
export class Galaxy2Domain049Controller {
  constructor(private readonly service: Galaxy2Domain049Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain049ExecutionRequest) {
    return this.service.execute(request);
  }
}