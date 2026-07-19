import { Injectable } from "@nestjs/common";
import { FactoryArtifactService } from "./artifact.service";
import { FactoryProjectService } from "./project.service";
import { FactorySnapshotService } from "./snapshot.service";

@Injectable()
export class FactoryWorkspaceService {
  constructor(
    private readonly projects: FactoryProjectService,
    private readonly artifacts: FactoryArtifactService,
    private readonly snapshots: FactorySnapshotService,
  ) {}

  summary() {
    const projects = this.projects.list();
    const artifacts = this.artifacts.list();
    const snapshots = this.snapshots.list();

    return {
      projects: {
        total: projects.length,
        active: projects.filter((project) => project.status === "active").length,
        archived: projects.filter((project) => project.status === "archived").length,
      },
      artifacts: {
        total: artifacts.length,
        byType: artifacts.reduce<Record<string, number>>((acc, artifact) => {
          acc[artifact.type] = (acc[artifact.type] ?? 0) + 1;
          return acc;
        }, {}),
      },
      snapshots: {
        total: snapshots.length,
      },
      generatedAt: new Date().toISOString(),
    };
  }
}
