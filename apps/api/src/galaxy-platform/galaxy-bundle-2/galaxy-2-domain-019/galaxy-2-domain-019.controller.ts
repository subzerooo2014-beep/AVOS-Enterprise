import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain019Service } from "./galaxy-2-domain-019.service";
import { Galaxy2Domain019ExecutionRequest } from "./galaxy-2-domain-019.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-019")
export class Galaxy2Domain019Controller {
  constructor(private readonly service: Galaxy2Domain019Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain019ExecutionRequest) {
    return this.service.execute(request);
  }
}