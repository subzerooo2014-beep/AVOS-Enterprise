import { Body, Controller, Get, Post } from "@nestjs/common";
import { GalaxyBundle8Service } from "./galaxy-bundle-8.service";
import { GalaxyBundle8ExecutionRequest } from "./galaxy-bundle-8.types";

@Controller("galaxy-platform/bundle-8")
export class GalaxyBundle8Controller {
  constructor(private readonly service: GalaxyBundle8Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: GalaxyBundle8ExecutionRequest) {
    return this.service.execute(request);
  }
}