import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain033Service } from "./galaxy-2-domain-033.service";
import { Galaxy2Domain033ExecutionRequest } from "./galaxy-2-domain-033.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-033")
export class Galaxy2Domain033Controller {
  constructor(private readonly service: Galaxy2Domain033Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain033ExecutionRequest) {
    return this.service.execute(request);
  }
}