import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain074Service } from "./galaxy-2-domain-074.service";
import { Galaxy2Domain074ExecutionRequest } from "./galaxy-2-domain-074.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-074")
export class Galaxy2Domain074Controller {
  constructor(private readonly service: Galaxy2Domain074Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain074ExecutionRequest) {
    return this.service.execute(request);
  }
}