import { Body, Controller, Get, Post } from "@nestjs/common";
import { FactoryFinalRequest } from "./factory-final.contracts";
import { FactoryFinalOrchestratorService } from "./factory-final-orchestrator.service";

@Controller("avos/factory/v1/final")
export class FactoryFinalController {
  constructor(
    private readonly orchestrator: FactoryFinalOrchestratorService
  ) {}

  @Post("execute")
  execute(@Body() request: FactoryFinalRequest) {
    return this.orchestrator.execute(request);
  }

  @Post("smoke/run")
  smoke() {
    return this.orchestrator.smoke();
  }

  @Get("health")
  health() {
    return this.orchestrator.health();
  }

  @Get("roadmap")
  roadmap() {
    return this.orchestrator.roadmap();
  }
}
