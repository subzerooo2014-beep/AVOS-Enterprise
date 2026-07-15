import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain010Service } from "./galaxy-2-domain-010.service";
import { Galaxy2Domain010ExecutionRequest } from "./galaxy-2-domain-010.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-010")
export class Galaxy2Domain010Controller {
  constructor(private readonly service: Galaxy2Domain010Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain010ExecutionRequest) {
    return this.service.execute(request);
  }
}