import { Body, Controller, Get, Post } from "@nestjs/common";
import { SimulationPlatformService } from "./simulation-platform.service";
import { SimulationPlatformExecutionRequest } from "./simulation-platform.types";

@Controller("galaxy-platform/simulation-platform")
export class SimulationPlatformController {
  constructor(private readonly service: SimulationPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: SimulationPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}