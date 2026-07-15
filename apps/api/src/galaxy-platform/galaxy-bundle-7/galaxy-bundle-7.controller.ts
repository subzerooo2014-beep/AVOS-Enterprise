import { Body, Controller, Get, Post } from "@nestjs/common";
import { GalaxyBundle7Service } from "./galaxy-bundle-7.service";
import { GalaxyBundle7ExecutionRequest } from "./galaxy-bundle-7.types";

@Controller("galaxy-platform/bundle-7")
export class GalaxyBundle7Controller {
  constructor(private readonly service: GalaxyBundle7Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: GalaxyBundle7ExecutionRequest) {
    return this.service.execute(request);
  }
}