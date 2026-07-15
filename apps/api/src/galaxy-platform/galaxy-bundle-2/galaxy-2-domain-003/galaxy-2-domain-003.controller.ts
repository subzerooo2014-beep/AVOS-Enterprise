import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain003Service } from "./galaxy-2-domain-003.service";
import { Galaxy2Domain003ExecutionRequest } from "./galaxy-2-domain-003.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-003")
export class Galaxy2Domain003Controller {
  constructor(private readonly service: Galaxy2Domain003Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain003ExecutionRequest) {
    return this.service.execute(request);
  }
}