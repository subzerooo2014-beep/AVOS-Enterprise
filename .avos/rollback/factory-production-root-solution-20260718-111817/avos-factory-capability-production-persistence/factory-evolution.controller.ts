import {
  Body,
  Controller,
  Get,
  Post
} from "@nestjs/common";
import { FactoryEvolutionRequest } from "./factory-evolution.contracts";
import { FactoryEvolutionOrchestratorService } from "./factory-evolution-orchestrator.service";
import { PipelineTemplateRegistryService } from "./pipeline-template-registry.service";

@Controller("avos/factory/v1/evolution")
export class FactoryEvolutionController {
  constructor(
    private readonly orchestrator:
      FactoryEvolutionOrchestratorService,
    private readonly templates:
      PipelineTemplateRegistryService
  ) {}

  @Post("execute")
  execute(@Body() request: FactoryEvolutionRequest) {
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

  @Get("templates")
  listTemplates() {
    return {
      success: true,
      templates: this.templates.list()
    };
  }
}
