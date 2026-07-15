import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain007Service } from "./galaxy-2-domain-007.service";
import { Galaxy2Domain007ExecutionRequest } from "./galaxy-2-domain-007.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-007")
export class Galaxy2Domain007Controller {
  constructor(private readonly service: Galaxy2Domain007Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain007ExecutionRequest) {
    return this.service.execute(request);
  }
}