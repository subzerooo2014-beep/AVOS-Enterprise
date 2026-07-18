import {
  Body,
  Controller,
  Get,
  Post,
  Query
} from "@nestjs/common";
import { CapabilityProductionBlueprint } from "./capability-production-persistence.contracts";
import { CapabilityArtifactRepositoryService } from "./capability-artifact-repository.service";
import { GeneratedSourceMaterializerService } from "./generated-source-materializer.service";
import { PersistentProductionRegistryService } from "./persistent-production-registry.service";

@Controller("avos/factory/v1/capability-production-persistence")
export class CapabilityProductionPersistenceController {
  constructor(
    private readonly materializer: GeneratedSourceMaterializerService,
    private readonly registry: PersistentProductionRegistryService,
    private readonly artifacts: CapabilityArtifactRepositoryService
  ) {}

  @Post("materialize")
  materialize(@Body() blueprint: CapabilityProductionBlueprint) {
    return this.materializer.materialize(blueprint);
  }

  @Get("runs")
  runs(@Query("limit") limit?: string) {
    return {
      items: this.registry.list(limit ? Number(limit) : 100)
    };
  }

  @Get("artifacts")
  artifactList(@Query("limit") limit?: string) {
    return {
      items: this.artifacts.list(limit ? Number(limit) : 100)
    };
  }

  @Get("health")
  health() {
    return this.registry.health();
  }
}
