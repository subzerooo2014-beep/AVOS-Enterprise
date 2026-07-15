import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain054Service } from "./galaxy-2-domain-054.service";
import { Galaxy2Domain054ExecutionRequest } from "./galaxy-2-domain-054.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-054")
export class Galaxy2Domain054Controller {
  constructor(private readonly service: Galaxy2Domain054Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain054ExecutionRequest) {
    return this.service.execute(request);
  }
}