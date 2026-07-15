import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain072Service } from "./galaxy-2-domain-072.service";
import { Galaxy2Domain072ExecutionRequest } from "./galaxy-2-domain-072.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-072")
export class Galaxy2Domain072Controller {
  constructor(private readonly service: Galaxy2Domain072Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain072ExecutionRequest) {
    return this.service.execute(request);
  }
}