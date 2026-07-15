import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain012Service } from "./galaxy-2-domain-012.service";
import { Galaxy2Domain012ExecutionRequest } from "./galaxy-2-domain-012.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-012")
export class Galaxy2Domain012Controller {
  constructor(private readonly service: Galaxy2Domain012Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain012ExecutionRequest) {
    return this.service.execute(request);
  }
}