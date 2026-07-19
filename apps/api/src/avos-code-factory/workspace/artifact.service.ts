import { Injectable } from "@nestjs/common";
import { FactoryArtifact } from "../contracts/workspace.contracts";
import { CreateArtifactDto } from "../dto/create-artifact.dto";
import { createFactoryChecksum } from "../utils/factory-checksum.util";
import { createFactoryId } from "../utils/factory-id.util";
import { FactoryProjectService } from "./project.service";
import { FactoryEventBusService } from "../events/event-bus.service";

@Injectable()
export class FactoryArtifactService {
  private readonly artifacts = new Map<string, FactoryArtifact>();

  constructor(
    private readonly projects: FactoryProjectService,
    private readonly events: FactoryEventBusService,
  ) {}

  async create(dto: CreateArtifactDto): Promise<FactoryArtifact> {
    const project = this.projects.get(dto.projectId);
    if (!project) {
      throw new Error(`Factory project '${dto.projectId}' was not found.`);
    }

    const existing = this.findByPath(dto.projectId, dto.relativePath);
    const now = new Date().toISOString();

    const artifact: FactoryArtifact = {
      id: existing?.id ?? createFactoryId("factory-artifact"),
      projectId: dto.projectId,
      type: dto.type,
      relativePath: this.normalizePath(dto.relativePath),
      content: dto.content,
      checksum: createFactoryChecksum(dto.content),
      version: existing ? existing.version + 1 : 1,
      metadata: dto.metadata ?? existing?.metadata ?? {},
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.artifacts.set(artifact.id, artifact);

    await this.events.publish(
      existing ? "factory.artifact.updated" : "factory.artifact.created",
      "factory-workspace",
      {
        artifactId: artifact.id,
        projectId: artifact.projectId,
        relativePath: artifact.relativePath,
        version: artifact.version,
      },
      { subject: artifact.id },
    );

    return artifact;
  }

  get(id: string): FactoryArtifact | undefined {
    return this.artifacts.get(id);
  }

  list(projectId?: string): FactoryArtifact[] {
    const values = [...this.artifacts.values()];
    return values
      .filter((artifact) => !projectId || artifact.projectId === projectId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  findByPath(projectId: string, relativePath: string): FactoryArtifact | undefined {
    const normalized = this.normalizePath(relativePath);
    return [...this.artifacts.values()].find(
      (artifact) =>
        artifact.projectId === projectId &&
        artifact.relativePath === normalized,
    );
  }

  private normalizePath(value: string): string {
    const normalized = value.replace(/\\/g, "/").replace(/^\/+/, "");
    if (normalized.includes("../")) {
      throw new Error("Artifact relativePath cannot traverse outside the project.");
    }
    return normalized;
  }
}
