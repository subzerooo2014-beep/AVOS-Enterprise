import { Body, Controller, Get, Post } from "@nestjs/common";
import { GalaxyBundle5Service } from "./galaxy-bundle-5.service";
import { GalaxyBundle5ExecutionRequest } from "./galaxy-bundle-5.types";

@Controller("galaxy-platform/bundle-5")
export class GalaxyBundle5Controller {
  constructor(private readonly service: GalaxyBundle5Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: GalaxyBundle5ExecutionRequest) {
    return this.service.execute(request);
  }
}