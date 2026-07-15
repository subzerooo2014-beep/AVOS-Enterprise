import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain044Service } from "./galaxy-2-domain-044.service";
import { Galaxy2Domain044ExecutionRequest } from "./galaxy-2-domain-044.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-044")
export class Galaxy2Domain044Controller {
  constructor(private readonly service: Galaxy2Domain044Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain044ExecutionRequest) {
    return this.service.execute(request);
  }
}