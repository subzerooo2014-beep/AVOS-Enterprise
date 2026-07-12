import { randomUUID } from "node:crypto";

export interface RollbackManifestEntry {
  relativePath: string;
  action: "delete-created" | "restore-overwritten";
  previousContent: string | null;
  previousHash: string | null;
}

export interface WorkspaceRollbackManifest {
  id: string;
  rootDirectory: string;
  entries: RollbackManifestEntry[];
  generatedAt: string;
}

export class RollbackManifestFactory {
  create(
    rootDirectory: string,
    entries: RollbackManifestEntry[],
  ): WorkspaceRollbackManifest {
    return {
      id: randomUUID(),
      rootDirectory,
      entries,
      generatedAt: new Date().toISOString(),
    };
  }
}
