import { Body, Controller, Get, Post } from "@nestjs/common";
import { NetworkPlatformService } from "./network-platform.service";
import { NetworkPlatformExecutionRequest } from "./network-platform.types";

@Controller("galaxy-platform/network-platform")
export class NetworkPlatformController {
  constructor(private readonly service: NetworkPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: NetworkPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}