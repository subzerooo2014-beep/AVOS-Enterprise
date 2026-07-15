import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain066Service } from "./galaxy-2-domain-066.service";
import { Galaxy2Domain066ExecutionRequest } from "./galaxy-2-domain-066.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-066")
export class Galaxy2Domain066Controller {
  constructor(private readonly service: Galaxy2Domain066Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain066ExecutionRequest) {
    return this.service.execute(request);
  }
}