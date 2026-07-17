import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import {
  LinkBlueprintNodeDto,
  RegisterBlueprintNodeDto,
  SynchronizeBlueprintDto,
  UpdateBlueprintRuntimeDto,
} from "./dto/living-blueprint.dto";
import { BlueprintEvolutionService } from "./services/blueprint-evolution.service";
import { BlueprintSnapshotService } from "./services/blueprint-snapshot.service";
import { BlueprintValidationService } from "./services/blueprint-validation.service";
import { LivingBlueprintCertificationService } from "./services/living-blueprint-certification.service";
import { LivingBlueprintRegistryService } from "./services/living-blueprint-registry.service";
import { RuntimeTopologyService } from "./services/runtime-topology.service";

@Controller("avos/living-blueprint")
export class LivingBlueprintController {
  constructor(
    private readonly registry: LivingBlueprintRegistryService,
    private readonly snapshots: BlueprintSnapshotService,
    private readonly topology: RuntimeTopologyService,
    private readonly validation: BlueprintValidationService,
    private readonly evolution: BlueprintEvolutionService,
    private readonly certification: LivingBlueprintCertificationService,
  ) {}

  @Get("health")
  health() {
    return this.validation.validate();
  }

  @Get("nodes")
  listNodes() {
    return this.registry.listNodes();
  }

  @Post("nodes")
  registerNode(@Body() body: RegisterBlueprintNodeDto) {
    return this.registry.registerNode(body);
  }

  @Get("nodes/:id")
  getNode(@Param("id") id: string) {
    return this.registry.getNode(id);
  }

  @Patch("nodes/:id/runtime")
  updateRuntime(@Param("id") id: string, @Body() body: UpdateBlueprintRuntimeDto) {
    return this.registry.updateRuntime(id, body);
  }

  @Get("edges")
  listEdges() {
    return this.registry.listEdges();
  }

  @Post("edges")
  linkNodes(@Body() body: LinkBlueprintNodeDto) {
    return this.registry.linkNodes(body);
  }

  @Get("topology")
  runtimeTopology() {
    return this.topology.build();
  }

  @Get("maps/services")
  serviceMap() {
    return this.topology.serviceMap();
  }

  @Get("maps/capabilities")
  capabilityMap() {
    return this.topology.capabilityMap();
  }

  @Get("maps/dependencies")
  dependencyMap() {
    return this.topology.dependencyMap();
  }

  @Get("maps/events")
  eventFlowMap() {
    return this.topology.eventFlowMap();
  }

  @Post("snapshots")
  createSnapshot(@Body() body: SynchronizeBlueprintDto) {
    return this.snapshots.createSnapshot(body);
  }

  @Get("snapshots")
  listSnapshots() {
    return this.snapshots.listSnapshots();
  }

  @Get("snapshots/latest")
  latestSnapshot() {
    return this.snapshots.latest();
  }

  @Get("snapshots/:id")
  getSnapshot(@Param("id") id: string) {
    return this.snapshots.getSnapshot(id);
  }

  @Get("diff")
  diff(
    @Query("fromSnapshotId") fromSnapshotId: string,
    @Query("toSnapshotId") toSnapshotId: string,
  ) {
    return this.snapshots.diff(fromSnapshotId, toSnapshotId);
  }

  @Get("evolution/timeline")
  timeline() {
    return this.evolution.timeline();
  }

  @Get("recommendations")
  recommendations() {
    return this.evolution.recommendations();
  }

  @Post("final-review/run")
  finalReview() {
    return this.certification.runFinalReview();
  }

  @Post("certification/certify")
  certify() {
    return this.certification.certify();
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.status();
  }
}