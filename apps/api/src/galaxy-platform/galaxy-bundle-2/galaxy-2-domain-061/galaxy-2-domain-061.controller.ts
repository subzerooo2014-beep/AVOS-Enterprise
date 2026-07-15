import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain061Service } from "./galaxy-2-domain-061.service";
import { Galaxy2Domain061ExecutionRequest } from "./galaxy-2-domain-061.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-061")
export class Galaxy2Domain061Controller {
  constructor(private readonly service: Galaxy2Domain061Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain061ExecutionRequest) {
    return this.service.execute(request);
  }
}