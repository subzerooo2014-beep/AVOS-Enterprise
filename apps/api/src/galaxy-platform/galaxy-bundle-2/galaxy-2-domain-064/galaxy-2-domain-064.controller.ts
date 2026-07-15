import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain064Service } from "./galaxy-2-domain-064.service";
import { Galaxy2Domain064ExecutionRequest } from "./galaxy-2-domain-064.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-064")
export class Galaxy2Domain064Controller {
  constructor(private readonly service: Galaxy2Domain064Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain064ExecutionRequest) {
    return this.service.execute(request);
  }
}