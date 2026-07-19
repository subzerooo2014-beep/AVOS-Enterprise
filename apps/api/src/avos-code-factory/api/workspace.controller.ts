import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreateArtifactDto } from "../dto/create-artifact.dto";
import { CreateProjectDto } from "../dto/create-project.dto";
import { CreateSnapshotDto } from "../dto/create-snapshot.dto";
import { FactoryArtifactService } from "../workspace/artifact.service";
import { FactoryProjectService } from "../workspace/project.service";
import { FactorySnapshotService } from "../workspace/snapshot.service";
import { FactoryWorkspaceService } from "../workspace/workspace.service";

@Controller("avos/code-factory/workspace")
export class FactoryWorkspaceController {
  constructor(
    private readonly workspace: FactoryWorkspaceService,
    private readonly projects: FactoryProjectService,
    private readonly artifacts: FactoryArtifactService,
    private readonly snapshots: FactorySnapshotService,
  ) {}

  @Get("summary")
  summary() {
    return this.workspace.summary();
  }

  @Get("projects")
  projectList() {
    return this.projects.list();
  }

  @Post("projects")
  createProject(@Body() dto: CreateProjectDto) {
    return this.projects.create(dto);
  }

  @Post("projects/:projectId/archive")
  archiveProject(@Param("projectId") projectId: string) {
    return this.projects.archive(projectId);
  }

  @Get("artifacts")
  artifactList(@Query("projectId") projectId?: string) {
    return this.artifacts.list(projectId);
  }

  @Post("artifacts")
  createArtifact(@Body() dto: CreateArtifactDto) {
    return this.artifacts.create(dto);
  }

  @Get("snapshots")
  snapshotList(@Query("projectId") projectId?: string) {
    return this.snapshots.list(projectId);
  }

  @Post("snapshots")
  createSnapshot(@Body() dto: CreateSnapshotDto) {
    return this.snapshots.create(dto);
  }

  @Post("snapshots/:snapshotId/restore")
  restoreSnapshot(@Param("snapshotId") snapshotId: string) {
    return this.snapshots.restore(snapshotId);
  }
}
