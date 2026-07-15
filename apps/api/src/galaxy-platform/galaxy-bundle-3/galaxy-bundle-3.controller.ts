import { Body, Controller, Get, Post } from "@nestjs/common";
import { GalaxyBundle3Service } from "./galaxy-bundle-3.service";
import { GalaxyBundle3ExecutionRequest } from "./galaxy-bundle-3.types";

@Controller("galaxy-platform/bundle-3")
export class GalaxyBundle3Controller {
  constructor(private readonly service: GalaxyBundle3Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: GalaxyBundle3ExecutionRequest) {
    return this.service.execute(request);
  }
}