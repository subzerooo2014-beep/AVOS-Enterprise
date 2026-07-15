import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain100Service } from "./galaxy-2-domain-100.service";
import { Galaxy2Domain100ExecutionRequest } from "./galaxy-2-domain-100.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-100")
export class Galaxy2Domain100Controller {
  constructor(private readonly service: Galaxy2Domain100Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain100ExecutionRequest) {
    return this.service.execute(request);
  }
}