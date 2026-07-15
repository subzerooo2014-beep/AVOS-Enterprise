import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain070Service } from "./galaxy-2-domain-070.service";
import { Galaxy2Domain070ExecutionRequest } from "./galaxy-2-domain-070.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-070")
export class Galaxy2Domain070Controller {
  constructor(private readonly service: Galaxy2Domain070Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain070ExecutionRequest) {
    return this.service.execute(request);
  }
}