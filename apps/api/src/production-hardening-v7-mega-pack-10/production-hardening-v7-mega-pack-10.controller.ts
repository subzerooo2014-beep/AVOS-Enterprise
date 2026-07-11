import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { AddReleaseArtifactDto } from "./dto/add-release-artifact.dto";
import { ApproveReleaseDto } from "./dto/approve-release.dto";
import { CreateReleaseDto } from "./dto/create-release.dto";
import { CreateRollbackPlanDto } from "./dto/create-rollback-plan.dto";
import { DeployReleaseDto } from "./dto/deploy-release.dto";
import { EvaluateReleaseDto } from "./dto/evaluate-release.dto";
import { RejectReleaseDto } from "./dto/reject-release.dto";
import { ProductionHardeningV7MegaPack10Service } from "./production-hardening-v7-mega-pack-10.service";

@Controller("production-hardening-v7-mega-pack-10")
export class ProductionHardeningV7MegaPack10Controller {
  constructor(
    private readonly service: ProductionHardeningV7MegaPack10Service,
  ) {}

  @Get("status")
  status() {
    return this.service.getStatus();
  }

  @Get("snapshot")
  snapshot() {
    return {
      success: true,
      snapshot: this.service.getSnapshot(),
    };
  }

  @Get("verify")
  verify() {
    return this.service.runVerification();
  }

  @Get("evidence/verify")
  verifyEvidence() {
    return {
      success: true,
      ...this.service.verifyEvidenceChain(),
    };
  }

  @Get("evidence")
  evidence() {
    return {
      success: true,
      entries: this.service.listEvidenceEntries(),
    };
  }

  @Get("events")
  events() {
    return {
      success: true,
      events: this.service.listPlatformEvents(),
    };
  }

  @Post("releases")
  createRelease(@Body() dto: CreateReleaseDto) {
    return {
      success: true,
      release: this.service.createRelease(dto, "api"),
    };
  }

  @Get("releases")
  listReleases() {
    return {
      success: true,
      releases: this.service.listReleases(),
    };
  }

  @Get("releases/:releaseId")
  getRelease(@Param("releaseId") releaseId: string) {
    return {
      success: true,
      release: this.service.getRelease(releaseId),
    };
  }

  @Post("releases/:releaseId/artifacts")
  addArtifact(
    @Param("releaseId") releaseId: string,
    @Body() dto: AddReleaseArtifactDto,
  ) {
    return {
      success: true,
      artifact: this.service.addArtifact(
        releaseId,
        dto,
        "api",
      ),
    };
  }

  @Post("artifacts/:artifactId/verify")
  verifyArtifact(
    @Param("artifactId") artifactId: string,
  ) {
    return {
      success: true,
      artifact: this.service.verifyArtifact(
        artifactId,
        "api",
      ),
    };
  }

  @Get("artifacts")
  listArtifacts(@Query("releaseId") releaseId?: string) {
    return {
      success: true,
      artifacts: this.service.listArtifacts(releaseId),
    };
  }

  @Post("releases/:releaseId/rollback-plans")
  createRollbackPlan(
    @Param("releaseId") releaseId: string,
    @Body() dto: CreateRollbackPlanDto,
  ) {
    return {
      success: true,
      rollbackPlan: this.service.createRollbackPlan(
        releaseId,
        dto,
        "api",
      ),
    };
  }

  @Post("rollback-plans/:planId/validate")
  validateRollbackPlan(@Param("planId") planId: string) {
    return {
      success: true,
      rollbackPlan: this.service.validateRollbackPlan(
        planId,
        "api",
      ),
    };
  }

  @Get("rollback-plans")
  listRollbackPlans(
    @Query("releaseId") releaseId?: string,
  ) {
    return {
      success: true,
      rollbackPlans:
        this.service.listRollbackPlans(releaseId),
    };
  }

  @Post("releases/:releaseId/evaluate")
  evaluateRelease(
    @Param("releaseId") releaseId: string,
    @Body() dto: EvaluateReleaseDto,
  ) {
    return {
      success: true,
      assessment: this.service.evaluateRelease(
        releaseId,
        dto,
        "api",
      ),
    };
  }

  @Post("releases/:releaseId/approve")
  approveRelease(
    @Param("releaseId") releaseId: string,
    @Body() dto: ApproveReleaseDto,
  ) {
    return {
      success: true,
      release: this.service.approveRelease(
        releaseId,
        dto,
      ),
    };
  }

  @Post("releases/:releaseId/reject")
  rejectRelease(
    @Param("releaseId") releaseId: string,
    @Body() dto: RejectReleaseDto,
  ) {
    return {
      success: true,
      release: this.service.rejectRelease(
        releaseId,
        dto,
      ),
    };
  }

  @Post("releases/:releaseId/deploy")
  deployRelease(
    @Param("releaseId") releaseId: string,
    @Body() dto: DeployReleaseDto,
  ) {
    return {
      success: true,
      deployment: this.service.deployRelease(
        releaseId,
        dto,
      ),
    };
  }

  @Post("releases/:releaseId/rollback")
  rollbackRelease(
    @Param("releaseId") releaseId: string,
  ) {
    return {
      success: true,
      deployment: this.service.rollbackRelease(
        releaseId,
        "api",
      ),
    };
  }

  @Get("release-gates")
  listGates(@Query("releaseId") releaseId?: string) {
    return {
      success: true,
      gates: this.service.listGates(releaseId),
    };
  }

  @Get("readiness-assessments")
  listAssessments(
    @Query("releaseId") releaseId?: string,
  ) {
    return {
      success: true,
      assessments:
        this.service.listAssessments(releaseId),
    };
  }

  @Get("deployments")
  listDeployments(
    @Query("releaseId") releaseId?: string,
  ) {
    return {
      success: true,
      deployments:
        this.service.listDeployments(releaseId),
    };
  }
}
