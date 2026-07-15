import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain092Service } from "./galaxy-2-domain-092.service";
import { Galaxy2Domain092ExecutionRequest } from "./galaxy-2-domain-092.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-092")
export class Galaxy2Domain092Controller {
  constructor(private readonly service: Galaxy2Domain092Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain092ExecutionRequest) {
    return this.service.execute(request);
  }
}