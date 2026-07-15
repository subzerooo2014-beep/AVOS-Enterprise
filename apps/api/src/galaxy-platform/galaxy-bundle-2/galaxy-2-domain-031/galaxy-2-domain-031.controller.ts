import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain031Service } from "./galaxy-2-domain-031.service";
import { Galaxy2Domain031ExecutionRequest } from "./galaxy-2-domain-031.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-031")
export class Galaxy2Domain031Controller {
  constructor(private readonly service: Galaxy2Domain031Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain031ExecutionRequest) {
    return this.service.execute(request);
  }
}