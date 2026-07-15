import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain008Service } from "./galaxy-2-domain-008.service";
import { Galaxy2Domain008ExecutionRequest } from "./galaxy-2-domain-008.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-008")
export class Galaxy2Domain008Controller {
  constructor(private readonly service: Galaxy2Domain008Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain008ExecutionRequest) {
    return this.service.execute(request);
  }
}