import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain096Service } from "./galaxy-2-domain-096.service";
import { Galaxy2Domain096ExecutionRequest } from "./galaxy-2-domain-096.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-096")
export class Galaxy2Domain096Controller {
  constructor(private readonly service: Galaxy2Domain096Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain096ExecutionRequest) {
    return this.service.execute(request);
  }
}