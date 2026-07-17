import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import type {
  PlatformResourceKind,
  PlatformResourceStatus
} from "./contracts/platform-control-plane.contracts";
import {
  CreatePlatformEnvironmentDto,
  RegisterPlatformResourceDto,
  SetPlatformConfigurationDto,
  UpdatePlatformResourceStatusDto
} from "./dto/platform-control-plane.dto";
import { PlatformControlPlaneService } from "./services/platform-control-plane.service";

@Controller("avos/platform/control-plane")
export class PlatformControlPlaneController {
  constructor(private readonly controlPlane: PlatformControlPlaneService) {}

  @Get("status")
  status() {
    return this.controlPlane.status();
  }

  @Get("health")
  health() {
    return this.controlPlane.health();
  }

  @Get("metrics")
  metrics() {
    return this.controlPlane.metrics();
  }

  @Get("environments")
  environments() {
    return this.controlPlane.environmentList();
  }

  @Get("environments/:id")
  environment(@Param("id") id: string) {
    return this.controlPlane.environment(id);
  }

  @Post("environments")
  createEnvironment(
    @Body() dto: CreatePlatformEnvironmentDto,
    @Query("actorId") actorId = "platform-admin"
  ) {
    return this.controlPlane.createEnvironment(dto, actorId);
  }

  @Get("resources")
  resources(
    @Query("environmentId") environmentId?: string,
    @Query("kind") kind?: PlatformResourceKind,
    @Query("status") status?: PlatformResourceStatus
  ) {
    return this.controlPlane.resourceList({
      environmentId,
      kind,
      status
    });
  }

  @Get("resources/:id")
  resource(@Param("id") id: string) {
    return this.controlPlane.resource(id);
  }

  @Post("resources")
  registerResource(
    @Body() dto: RegisterPlatformResourceDto,
    @Query("actorId") actorId = "platform-admin"
  ) {
    return this.controlPlane.registerResource(dto, actorId);
  }

  @Patch("resources/:id/status")
  updateResourceStatus(
    @Param("id") id: string,
    @Body() dto: UpdatePlatformResourceStatusDto
  ) {
    return this.controlPlane.updateResourceStatus(
      id,
      dto.status,
      dto.actorId
    );
  }

  @Get("dependency-graph")
  dependencyGraph() {
    return this.controlPlane.dependencyGraph();
  }

  @Post("configurations")
  setConfiguration(@Body() dto: SetPlatformConfigurationDto) {
    return this.controlPlane.setConfiguration(dto);
  }

  @Get("configurations")
  configurations(
    @Query("environmentId") environmentId?: string,
    @Query("namespace") namespace?: string
  ) {
    return this.controlPlane.configurationList(environmentId, namespace);
  }

  @Get("configurations/:environmentId/:namespace/:key")
  configuration(
    @Param("environmentId") environmentId: string,
    @Param("namespace") namespace: string,
    @Param("key") key: string
  ) {
    return this.controlPlane.configuration(environmentId, namespace, key);
  }

  @Get("audit")
  audit(
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number
  ) {
    return this.controlPlane.auditList(limit);
  }

  @Post("final-review/run")
  finalReview() {
    return this.controlPlane.finalReview();
  }

  @Post("certification/certify")
  certify() {
    return this.controlPlane.certify();
  }

  @Get("certification/status")
  certificationStatus() {
    return {
      review: this.controlPlane.finalReview(),
      certification: this.controlPlane.certify(),
      health: this.controlPlane.health()
    };
  }
}