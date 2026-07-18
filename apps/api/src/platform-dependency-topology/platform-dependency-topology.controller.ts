import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query
} from "@nestjs/common";
import { RegisterPlatformDependencyDto } from "./dto/register-platform-dependency.dto";
import { PlatformDependencyGraphService } from "./services/platform-dependency-graph.service";
import { PlatformDependencyRegistryService } from "./services/platform-dependency-registry.service";
import { PlatformDependencyTopologyService } from "./services/platform-dependency-topology.service";
import { PlatformDependencyValidationService } from "./services/platform-dependency-validation.service";
import { PlatformExecutionPlannerService } from "./services/platform-execution-planner.service";
import { PlatformImpactAnalysisService } from "./services/platform-impact-analysis.service";
import { PlatformTopologyAnalysisService } from "./services/platform-topology-analysis.service";

@Controller("avos/platform/dependency-topology")
export class PlatformDependencyTopologyController {
  constructor(
    private readonly registry: PlatformDependencyRegistryService,
    private readonly graph: PlatformDependencyGraphService,
    private readonly validation: PlatformDependencyValidationService,
    private readonly planner: PlatformExecutionPlannerService,
    private readonly impact: PlatformImpactAnalysisService,
    private readonly topology: PlatformTopologyAnalysisService,
    private readonly system: PlatformDependencyTopologyService
  ) {}

  @Get("status")
  status() {
    return this.system.status();
  }

  @Get("health")
  health() {
    return this.system.health();
  }

  @Post("dependencies")
  register(
    @Body() dto: RegisterPlatformDependencyDto,
    @Query("actorId") actorId?: string
  ) {
    return this.registry.register(dto, actorId ?? "system");
  }

  @Get("dependencies")
  list() {
    return this.registry.list();
  }

  @Delete("dependencies/:id")
  remove(@Param("id") id: string) {
    return this.registry.remove(id);
  }

  @Get("graph")
  graphView() {
    return this.graph.build();
  }

  @Post("validate")
  validate() {
    return this.validation.validate();
  }

  @Get("plans/startup")
  startup() {
    return this.planner.startup();
  }

  @Get("plans/shutdown")
  shutdown() {
    return this.planner.shutdown();
  }

  @Get("impact/:serviceId")
  impactView(@Param("serviceId") serviceId: string) {
    return this.impact.analyze(serviceId);
  }

  @Get("topology")
  topologyView() {
    return this.topology.analyze();
  }

  @Post("final-review/run")
  finalReview() {
    return this.system.finalReview();
  }

  @Post("certification/certify")
  certification() {
    return this.system.certification();
  }
}