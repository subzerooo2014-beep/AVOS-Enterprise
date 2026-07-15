import { Body, Controller, Get, Post } from "@nestjs/common";
import { GalaxyBundle6Service } from "./galaxy-bundle-6.service";
import { GalaxyBundle6ExecutionRequest } from "./galaxy-bundle-6.types";

@Controller("galaxy-platform/bundle-6")
export class GalaxyBundle6Controller {
  constructor(private readonly service: GalaxyBundle6Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: GalaxyBundle6ExecutionRequest) {
    return this.service.execute(request);
  }
}