import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain027Service } from "./galaxy-2-domain-027.service";
import { Galaxy2Domain027ExecutionRequest } from "./galaxy-2-domain-027.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-027")
export class Galaxy2Domain027Controller {
  constructor(private readonly service: Galaxy2Domain027Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain027ExecutionRequest) {
    return this.service.execute(request);
  }
}