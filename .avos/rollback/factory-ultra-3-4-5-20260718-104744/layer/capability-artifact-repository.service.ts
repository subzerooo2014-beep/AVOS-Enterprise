import { Injectable } from "@nestjs/common";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";
import { CapabilityArtifact } from "./capability-production-persistence.contracts";
import { CapabilityProductionPathsService } from "./capability-production-paths.service";

export interface ArtifactRepositoryRecord {
  runId: string;
  workspacePath: string;
  artifacts: CapabilityArtifact[];
  registeredAt: string;
}

@Injectable()
export class CapabilityArtifactRepositoryService {
  private readonly repositoryFile: string;

  constructor(paths: CapabilityProductionPathsService) {
    const root = paths.getRegistryRoot();
    mkdirSync(root, { recursive: true });

    this.repositoryFile = join(root, "artifact-repository.json");

    if (!existsSync(this.repositoryFile)) {
      this.write([]);
    }
  }

  register(
    input: Omit<ArtifactRepositoryRecord, "registeredAt">
  ): ArtifactRepositoryRecord {
    const record: ArtifactRepositoryRecord = {
      ...input,
      registeredAt: new Date().toISOString()
    };

    const records = this.read();
    records.push(record);
    this.write(records);

    return record;
  }

  list(limit = 100): ArtifactRepositoryRecord[] {
    return this.read()
      .slice(-Math.max(1, limit))
      .reverse();
  }

  private read(): ArtifactRepositoryRecord[] {
    try {
      const parsed = JSON.parse(
        readFileSync(this.repositoryFile, "utf8")
      ) as ArtifactRepositoryRecord[];

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private write(records: ArtifactRepositoryRecord[]): void {
    writeFileSync(
      this.repositoryFile,
      JSON.stringify(records, null, 2),
      "utf8"
    );
  }
}
