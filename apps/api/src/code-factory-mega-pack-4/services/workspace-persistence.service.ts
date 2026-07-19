import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { CreateWorkspaceDto } from "../dto/create-workspace.dto";
import { AtomicFileWriterService } from "../infrastructure/atomic-file-writer.service";
import { PersistentFactoryRepository } from "../repositories/persistent-factory.repository";
import { WorkspaceMetadata } from "../types/persistence.types";
import { AuditTraceService } from "./audit-trace.service";

@Injectable()
export class WorkspacePersistenceService {
  constructor(
    private readonly repository: PersistentFactoryRepository,
    private readonly writer: AtomicFileWriterService,
    private readonly audit: AuditTraceService
  ) {}

  async create(dto: CreateWorkspaceDto): Promise<WorkspaceMetadata> {
    const duplicate = this.repository
      .listWorkspaces()
      .find(
        (item) =>
          item.projectId === dto.projectId &&
          item.name.toLowerCase() === dto.name.toLowerCase() &&
          item.status !== "archived"
      );

    if (duplicate) {
      throw new ConflictException(
        `Workspace already exists for project ${dto.projectId}: ${dto.name}`
      );
    }

    const id = `workspace:${Date.now()}:${randomUUID()}`;
    const safeFolder = id.replace(/[^a-zA-Z0-9._-]/g, "_");
    const rootPath = path.join(this.repository.workspaceRoot, safeFolder);
    const now = new Date().toISOString();

    const workspace: WorkspaceMetadata = {
      id,
      projectId: dto.projectId,
      name: dto.name,
      description: dto.description,
      status: "created",
      rootPath,
      version: 1,
      createdAt: now,
      updatedAt: now,
      metadata: dto.metadata ?? {}
    };

    await fs.mkdir(rootPath, { recursive: true });
    await this.writer.writeJson(path.join(rootPath, ".avos-workspace.json"), {
      id: workspace.id,
      projectId: workspace.projectId,
      name: workspace.name,
      version: workspace.version,
      createdAt: workspace.createdAt
    });

    workspace.status = "persisted";
    workspace.lastPersistedAt = new Date().toISOString();
    workspace.updatedAt = workspace.lastPersistedAt;

    await this.repository.saveWorkspace(workspace);
    await this.audit.record("workspace.created", { name: workspace.name }, id);

    return workspace;
  }

  list(): WorkspaceMetadata[] {
    return this.repository.listWorkspaces();
  }

  get(id: string): WorkspaceMetadata {
    const workspace = this.repository.getWorkspace(id);
    if (!workspace) {
      throw new NotFoundException(`Workspace not found: ${id}`);
    }
    return workspace;
  }

  async update(
    workspace: WorkspaceMetadata,
    patch: Partial<WorkspaceMetadata>
  ): Promise<WorkspaceMetadata> {
    const updated: WorkspaceMetadata = {
      ...workspace,
      ...patch,
      updatedAt: new Date().toISOString()
    };

    await this.repository.saveWorkspace(updated);
    await this.writer.writeJson(
      path.join(updated.rootPath, ".avos-workspace.json"),
      updated
    );

    return updated;
  }
}