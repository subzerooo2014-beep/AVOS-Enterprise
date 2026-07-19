import { Injectable } from "@nestjs/common";
import { FactorySnapshot } from "../contracts/workspace.contracts";
import { CreateSnapshotDto } from "../dto/create-snapshot.dto";
import { createFactoryId } from "../utils/factory-id.util";
import { FactoryArtifactService } from "./artifact.service";
import { FactoryProjectService } from "./project.service";
import { FactoryEventBusService } from "../events/event-bus.service";

@Injectable()
export class FactorySnapshotService {
  private readonly snapshots = new Map<string, FactorySnapshot>();

  constructor(
    private readonly projects: FactoryProjectService,
    private readonly artifacts: FactoryArtifactService,
    private readonly events: FactoryEventBusService,
  ) {}

  async create(dto: CreateSnapshotDto): Promise<FactorySnapshot> {
    const project = this.projects.get(dto.projectId);
    if (!project) {
      throw new Error(`Factory project '${dto.projectId}' was not found.`);
    }

    const snapshot: FactorySnapshot = {
      id: createFactoryId("factory-snapshot"),
      projectId: dto.projectId,
      label: dto.label.trim(),
      artifactIds: this.artifacts.list(dto.projectId).map((artifact) => artifact.id),
      createdAt: new Date().toISOString(),
      metadata: dto.metadata ?? {},
    };

    this.snapshots.set(snapshot.id, snapshot);

    await this.events.publish(
      "factory.snapshot.created",
      "factory-workspace",
      {
        snapshotId: snapshot.id,
        projectId: snapshot.projectId,
        artifactCount: snapshot.artifactIds.length,
      },
      { subject: snapshot.id },
    );

    return snapshot;
  }

  get(id: string): FactorySnapshot | undefined {
    return this.snapshots.get(id);
  }

  list(projectId?: string): FactorySnapshot[] {
    return [...this.snapshots.values()]
      .filter((snapshot) => !projectId || snapshot.projectId === projectId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  restore(id: string) {
    const snapshot = this.snapshots.get(id);
    if (!snapshot) {
      throw new Error(`Factory snapshot '${id}' was not found.`);
    }

    const artifacts = snapshot.artifactIds
      .map((artifactId) => this.artifacts.get(artifactId))
      .filter((artifact): artifact is NonNullable<typeof artifact> => Boolean(artifact));

    return {
      snapshot,
      artifacts,
      restoredAt: new Date().toISOString(),
    };
  }
}
