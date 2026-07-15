import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain091Service } from "./galaxy-2-domain-091.service";
import { Galaxy2Domain091ExecutionRequest } from "./galaxy-2-domain-091.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-091")
export class Galaxy2Domain091Controller {
  constructor(private readonly service: Galaxy2Domain091Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain091ExecutionRequest) {
    return this.service.execute(request);
  }
}