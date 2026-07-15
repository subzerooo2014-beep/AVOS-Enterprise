import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain036Service } from "./galaxy-2-domain-036.service";
import { Galaxy2Domain036ExecutionRequest } from "./galaxy-2-domain-036.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-036")
export class Galaxy2Domain036Controller {
  constructor(private readonly service: Galaxy2Domain036Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain036ExecutionRequest) {
    return this.service.execute(request);
  }
}