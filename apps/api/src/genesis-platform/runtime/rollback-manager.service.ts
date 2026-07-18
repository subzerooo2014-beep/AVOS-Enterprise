import { Injectable } from "@nestjs/common";
import { GenesisArtifactRegistry } from "../registry/genesis-artifact.registry";

@Injectable()
export class RollbackManagerService {
  constructor(private readonly artifactRegistry: GenesisArtifactRegistry) {}

  rollback(artifactIds: string[]): {
    rolledBack: string[];
    missing: string[];
  } {
    const rolledBack: string[] = [];
    const missing: string[] = [];

    for (const id of artifactIds) {
      const artifact = this.artifactRegistry.get(id);
      if (!artifact) {
        missing.push(id);
        continue;
      }

      this.artifactRegistry.update(id, { status: "rolled-back" });
      rolledBack.push(id);
    }

    return { rolledBack, missing };
  }
}
