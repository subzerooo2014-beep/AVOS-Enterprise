import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain063Service } from "./galaxy-2-domain-063.service";
import { Galaxy2Domain063ExecutionRequest } from "./galaxy-2-domain-063.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-063")
export class Galaxy2Domain063Controller {
  constructor(private readonly service: Galaxy2Domain063Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain063ExecutionRequest) {
    return this.service.execute(request);
  }
}