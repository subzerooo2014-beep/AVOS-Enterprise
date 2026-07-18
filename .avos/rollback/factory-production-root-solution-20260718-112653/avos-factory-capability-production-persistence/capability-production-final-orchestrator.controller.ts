import {
  Body,
  Controller,
  Get,
  Post
} from "@nestjs/common";
import {
  CapabilityProductionFinalOrchestratorService,
  FactoryFinalOrchestrationRequest
} from "./capability-production-final-orchestrator.service";

@Controller("avos/factory/v1/final-orchestrator")
export class CapabilityProductionFinalOrchestratorController {
  constructor(
    private readonly orchestrator:
      CapabilityProductionFinalOrchestratorService
  ) {}

  @Post("execute")
  execute(
    @Body()
    request: FactoryFinalOrchestrationRequest
  ) {
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
}
