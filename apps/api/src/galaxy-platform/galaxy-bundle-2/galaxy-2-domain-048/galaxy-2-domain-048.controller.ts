import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain048Service } from "./galaxy-2-domain-048.service";
import { Galaxy2Domain048ExecutionRequest } from "./galaxy-2-domain-048.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-048")
export class Galaxy2Domain048Controller {
  constructor(private readonly service: Galaxy2Domain048Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain048ExecutionRequest) {
    return this.service.execute(request);
  }
}