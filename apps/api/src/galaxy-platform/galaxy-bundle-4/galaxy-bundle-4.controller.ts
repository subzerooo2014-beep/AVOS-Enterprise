import { Body, Controller, Get, Post } from "@nestjs/common";
import { GalaxyBundle4Service } from "./galaxy-bundle-4.service";
import { GalaxyBundle4ExecutionRequest } from "./galaxy-bundle-4.types";

@Controller("galaxy-platform/bundle-4")
export class GalaxyBundle4Controller {
  constructor(private readonly service: GalaxyBundle4Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: GalaxyBundle4ExecutionRequest) {
    return this.service.execute(request);
  }
}