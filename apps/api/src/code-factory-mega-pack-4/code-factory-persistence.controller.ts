import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query
} from "@nestjs/common";
import { CreateCheckpointDto } from "./dto/create-checkpoint.dto";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { MaterializeWorkspaceDto } from "./dto/materialize-workspace.dto";
import { RegisterPackageDto } from "./dto/register-package.dto";
import { RestoreWorkspaceDto } from "./dto/restore-workspace.dto";
import { StartRunDto } from "./dto/start-run.dto";
import { PersistentFactoryRepository } from "./repositories/persistent-factory.repository";
import { ArtifactMaterializationService } from "./services/artifact-materialization.service";
import { AutonomousRunHistoryService } from "./services/autonomous-run-history.service";
import { CheckpointService } from "./services/checkpoint.service";
import { PackageRegistryService } from "./services/package-registry.service";
import { PersistenceCertificationService } from "./services/persistence-certification.service";
import { PersistenceSmokeService } from "./services/persistence-smoke.service";
import { PersistenceVerificationService } from "./services/persistence-verification.service";
import { SnapshotManagerService } from "./services/snapshot-manager.service";
import { SynchronizationService } from "./services/synchronization.service";
import { WorkspaceHealthService } from "./services/workspace-health.service";
import { WorkspacePersistenceService } from "./services/workspace-persistence.service";
import { WorkspaceRecoveryService } from "./services/workspace-recovery.service";

@Controller("avos/code-factory/persistence")
export class CodeFactoryPersistenceController {
  constructor(
    private readonly repository: PersistentFactoryRepository,
    private readonly workspaces: WorkspacePersistenceService,
    private readonly materialization: ArtifactMaterializationService,
    private readonly snapshots: SnapshotManagerService,
    private readonly checkpoints: CheckpointService,
    private readonly recovery: WorkspaceRecoveryService,
    private readonly synchronization: SynchronizationService,
    private readonly runs: AutonomousRunHistoryService,
    private readonly packages: PackageRegistryService,
    private readonly health: WorkspaceHealthService,
    private readonly verification: PersistenceVerificationService,
    private readonly smoke: PersistenceSmokeService,
    private readonly certification: PersistenceCertificationService
  ) {}

  @Get("status")
  status() {
    const state = this.repository.snapshot();
    return {
      name: "AVOS Code Factory Mega Pack 4",
      capability: "Persistent Factory Memory & Workspace Materialization",
      version: "CF-MP4.0.0",
      status: "operational",
      dataRoot: this.repository.dataRoot,
      totals: {
        workspaces: state.workspaces.length,
        artifacts: state.artifacts.length,
        snapshots: state.snapshots.length,
        checkpoints: state.checkpoints.length,
        runs: state.runs.length,
        certifications: state.certifications.length,
        audits: state.audits.length,
        packages: state.packages.length
      },
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true
    };
  }

  @Post("workspaces")
  createWorkspace(@Body() dto: CreateWorkspaceDto) {
    return this.workspaces.create(dto);
  }

  @Get("workspaces")
  listWorkspaces() {
    return this.workspaces.list();
  }

  @Get("workspaces/:workspaceId")
  getWorkspace(@Param("workspaceId") workspaceId: string) {
    return this.workspaces.get(workspaceId);
  }

  @Post("workspaces/:workspaceId/materialize")
  materialize(
    @Param("workspaceId") workspaceId: string,
    @Body() dto: MaterializeWorkspaceDto
  ) {
    return this.materialization.materialize(workspaceId, dto);
  }

  @Post("workspaces/:workspaceId/snapshots")
  createSnapshot(
    @Param("workspaceId") workspaceId: string,
    @Body("reason") reason?: string
  ) {
    return this.snapshots.create(workspaceId, reason);
  }

  @Post("workspaces/:workspaceId/checkpoints")
  createCheckpoint(
    @Param("workspaceId") workspaceId: string,
    @Body() dto: CreateCheckpointDto
  ) {
    return this.checkpoints.create(
      workspaceId,
      dto.label,
      dto.createdBy
    );
  }

  @Post("workspaces/:workspaceId/restore")
  restore(
    @Param("workspaceId") workspaceId: string,
    @Body() dto: RestoreWorkspaceDto
  ) {
    return this.recovery.restore(workspaceId, dto);
  }

  @Post("workspaces/:workspaceId/synchronize")
  synchronize(@Param("workspaceId") workspaceId: string) {
    return this.synchronization.synchronize(workspaceId);
  }

  @Get("workspaces/:workspaceId/health")
  workspaceHealth(@Param("workspaceId") workspaceId: string) {
    return this.health.check(workspaceId);
  }

  @Post("workspaces/:workspaceId/runs")
  startRun(
    @Param("workspaceId") workspaceId: string,
    @Body() dto: StartRunDto
  ) {
    return this.runs.start(workspaceId, dto.objective, dto.input);
  }

  @Post("runs/:runId/complete")
  completeRun(
    @Param("runId") runId: string,
    @Body("output") output?: Record<string, unknown>
  ) {
    return this.runs.complete(runId, output);
  }

  @Post("workspaces/:workspaceId/packages")
  registerPackage(
    @Param("workspaceId") workspaceId: string,
    @Body() dto: RegisterPackageDto
  ) {
    return this.packages.register(workspaceId, dto);
  }

  @Get("repository")
  repositoryState(@Query("workspaceId") workspaceId?: string) {
    return {
      workspaces: workspaceId
        ? [this.workspaces.get(workspaceId)]
        : this.repository.listWorkspaces(),
      artifacts: this.repository.listArtifacts(workspaceId),
      snapshots: this.repository.listSnapshots(workspaceId),
      checkpoints: this.repository.listCheckpoints(workspaceId),
      runs: this.repository.listRuns(workspaceId),
      certifications: this.repository.listCertifications(workspaceId),
      audits: this.repository.listAudits(workspaceId),
      packages: this.repository.listPackages(workspaceId)
    };
  }

  @Post("verification/run")
  verify() {
    return this.verification.run();
  }

  @Post("smoke/run")
  runSmoke() {
    return this.smoke.run();
  }

  @Post("certification/certify")
  certify(@Body("approvedBy") approvedBy?: string) {
    return this.certification.certify(approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.latest();
  }
}