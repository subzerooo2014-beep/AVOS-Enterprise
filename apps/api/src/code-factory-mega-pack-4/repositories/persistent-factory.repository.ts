import { Injectable, OnModuleInit } from "@nestjs/common";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { AtomicFileWriterService } from "../infrastructure/atomic-file-writer.service";
import {
  AuditRecord,
  AutonomousRunRecord,
  FactoryCertification,
  GenerationPackageRecord,
  MaterializedArtifact,
  RepositoryState,
  WorkspaceCheckpoint,
  WorkspaceMetadata,
  WorkspaceSnapshot
} from "../types/persistence.types";

@Injectable()
export class PersistentFactoryRepository implements OnModuleInit {
  private state: RepositoryState = this.emptyState();
  private operation = Promise.resolve();

  constructor(private readonly writer: AtomicFileWriterService) {}

  async onModuleInit(): Promise<void> {
    await this.load();
  }

  get dataRoot(): string {
    return (
      process.env.AVOS_CODE_FACTORY_DATA_ROOT ??
      path.resolve(process.cwd(), ".avos-data", "code-factory")
    );
  }

  get workspaceRoot(): string {
    return path.join(this.dataRoot, "workspaces");
  }

  get snapshotRoot(): string {
    return path.join(this.dataRoot, "snapshots");
  }

  get artifactRoot(): string {
    return path.join(this.dataRoot, "artifacts");
  }

  get repositoryPath(): string {
    return path.join(this.dataRoot, "repository.json");
  }

  async load(): Promise<void> {
    await fs.mkdir(this.dataRoot, { recursive: true });
    await fs.mkdir(this.workspaceRoot, { recursive: true });
    await fs.mkdir(this.snapshotRoot, { recursive: true });
    await fs.mkdir(this.artifactRoot, { recursive: true });

    try {
      const raw = await fs.readFile(this.repositoryPath, "utf8");
      const parsed = JSON.parse(raw) as Partial<RepositoryState>;
      this.state = {
        ...this.emptyState(),
        ...parsed,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
      await this.persist();
    }
  }

  snapshot(): RepositoryState {
    return structuredClone(this.state);
  }

  getWorkspace(id: string): WorkspaceMetadata | undefined {
    return this.state.workspaces.find((item) => item.id === id);
  }

  listWorkspaces(): WorkspaceMetadata[] {
    return [...this.state.workspaces];
  }

  listArtifacts(workspaceId?: string): MaterializedArtifact[] {
    return this.state.artifacts.filter(
      (item) => !workspaceId || item.workspaceId === workspaceId
    );
  }

  listSnapshots(workspaceId?: string): WorkspaceSnapshot[] {
    return this.state.snapshots.filter(
      (item) => !workspaceId || item.workspaceId === workspaceId
    );
  }

  listCheckpoints(workspaceId?: string): WorkspaceCheckpoint[] {
    return this.state.checkpoints.filter(
      (item) => !workspaceId || item.workspaceId === workspaceId
    );
  }

  listRuns(workspaceId?: string): AutonomousRunRecord[] {
    return this.state.runs.filter(
      (item) => !workspaceId || item.workspaceId === workspaceId
    );
  }

  listCertifications(workspaceId?: string): FactoryCertification[] {
    return this.state.certifications.filter(
      (item) => !workspaceId || item.workspaceId === workspaceId
    );
  }

  listAudits(workspaceId?: string): AuditRecord[] {
    return this.state.audits.filter(
      (item) => !workspaceId || item.workspaceId === workspaceId
    );
  }

  listPackages(workspaceId?: string): GenerationPackageRecord[] {
    return this.state.packages.filter(
      (item) => !workspaceId || item.workspaceId === workspaceId
    );
  }

  async saveWorkspace(value: WorkspaceMetadata): Promise<void> {
    await this.mutate((state) => {
      const index = state.workspaces.findIndex((item) => item.id === value.id);
      if (index >= 0) state.workspaces[index] = value;
      else state.workspaces.push(value);
    });
  }

  async saveArtifacts(values: MaterializedArtifact[]): Promise<void> {
    await this.mutate((state) => {
      for (const value of values) {
        const index = state.artifacts.findIndex((item) => item.id === value.id);
        if (index >= 0) state.artifacts[index] = value;
        else state.artifacts.push(value);
      }
    });
  }

  async saveSnapshot(value: WorkspaceSnapshot): Promise<void> {
    await this.mutate((state) => state.snapshots.push(value));
  }

  async saveCheckpoint(value: WorkspaceCheckpoint): Promise<void> {
    await this.mutate((state) => state.checkpoints.push(value));
  }

  async saveRun(value: AutonomousRunRecord): Promise<void> {
    await this.mutate((state) => {
      const index = state.runs.findIndex((item) => item.id === value.id);
      if (index >= 0) state.runs[index] = value;
      else state.runs.push(value);
    });
  }

  async saveCertification(value: FactoryCertification): Promise<void> {
    await this.mutate((state) => state.certifications.push(value));
  }

  async saveAudit(value: AuditRecord): Promise<void> {
    await this.mutate((state) => state.audits.push(value));
  }

  async savePackage(value: GenerationPackageRecord): Promise<void> {
    await this.mutate((state) => {
      const index = state.packages.findIndex((item) => item.id === value.id);
      if (index >= 0) state.packages[index] = value;
      else state.packages.push(value);
    });
  }

  private async mutate(
    mutator: (state: RepositoryState) => void
  ): Promise<void> {
    this.operation = this.operation.then(async () => {
      mutator(this.state);
      this.state.updatedAt = new Date().toISOString();
      await this.persist();
    });
    await this.operation;
  }

  private async persist(): Promise<void> {
    await this.writer.writeJson(this.repositoryPath, this.state);
  }

  private emptyState(): RepositoryState {
    return {
      workspaces: [],
      artifacts: [],
      snapshots: [],
      checkpoints: [],
      runs: [],
      certifications: [],
      audits: [],
      packages: [],
      updatedAt: new Date().toISOString()
    };
  }
}