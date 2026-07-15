import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain057Service } from "./galaxy-2-domain-057.service";
import { Galaxy2Domain057ExecutionRequest } from "./galaxy-2-domain-057.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-057")
export class Galaxy2Domain057Controller {
  constructor(private readonly service: Galaxy2Domain057Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain057ExecutionRequest) {
    return this.service.execute(request);
  }
}