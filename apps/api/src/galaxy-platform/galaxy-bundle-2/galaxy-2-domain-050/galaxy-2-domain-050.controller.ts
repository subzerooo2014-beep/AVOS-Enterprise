import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain050Service } from "./galaxy-2-domain-050.service";
import { Galaxy2Domain050ExecutionRequest } from "./galaxy-2-domain-050.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-050")
export class Galaxy2Domain050Controller {
  constructor(private readonly service: Galaxy2Domain050Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain050ExecutionRequest) {
    return this.service.execute(request);
  }
}