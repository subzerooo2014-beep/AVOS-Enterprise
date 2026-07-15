import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain089Service } from "./galaxy-2-domain-089.service";
import { Galaxy2Domain089ExecutionRequest } from "./galaxy-2-domain-089.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-089")
export class Galaxy2Domain089Controller {
  constructor(private readonly service: Galaxy2Domain089Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain089ExecutionRequest) {
    return this.service.execute(request);
  }
}