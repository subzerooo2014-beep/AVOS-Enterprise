import { WorkspaceMaterializationResult } from "./workspace-materializer";

export interface WorkspaceIntegrityReport {
  healthy: boolean;
  mode: string;
  operations: number;
  created: number;
  overwritten: number;
  skipped: number;
  verified: number;
  failed: number;
  rollbackEntries: number;
  findingCount: number;
  evidenceCount: number;
}

export class WorkspaceIntegrityReporter {
  report(
    result: WorkspaceMaterializationResult,
  ): WorkspaceIntegrityReport {
    return {
      healthy:
        result.success &&
        result.operations.every((operation) => operation.success) &&
        result.operations
          .filter((operation) => operation.action !== "skip")
          .every((operation) => operation.verified),
      mode: result.mode,
      operations: result.operations.length,
      created: result.operations.filter((operation) => operation.action === "create").length,
      overwritten: result.operations.filter((operation) => operation.action === "overwrite").length,
      skipped: result.operations.filter((operation) => operation.action === "skip").length,
      verified: result.operations.filter((operation) => operation.verified).length,
      failed: result.operations.filter((operation) => !operation.success).length,
      rollbackEntries: result.rollbackManifest.entries.length,
      findingCount: result.findings.length,
      evidenceCount: result.evidence.length,
    };
  }
}
