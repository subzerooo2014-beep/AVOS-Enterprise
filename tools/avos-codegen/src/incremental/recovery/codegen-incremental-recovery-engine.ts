import {
  CodeGenIncrementalRun,
  CodeGenIncrementalRunStatus,
} from "../contracts/codegen-incremental.contracts";
import {
  CodeGenIncrementalSnapshotStore,
} from "../persistence/codegen-incremental-snapshot-store";

export class CodeGenIncrementalRecoveryEngine {
  constructor(
    readonly snapshots =
      new CodeGenIncrementalSnapshotStore(),
  ) {}

  async recover(
    run:
      CodeGenIncrementalRun,
  ): Promise<
    CodeGenIncrementalRun
  > {
    const snapshot =
      await this.snapshots.load(
        run.snapshotPath,
      );

    if (!snapshot) {
      return {
        ...structuredClone(run),
        status:
          CodeGenIncrementalRunStatus.FAILED,
        errors: [
          ...run.errors,
          "Incremental snapshot was not found",
        ],
        updatedAt:
          new Date().toISOString(),
        completedAt:
          new Date().toISOString(),
      };
    }

    return {
      ...structuredClone(run),
      status:
        CodeGenIncrementalRunStatus.RECOVERED,
      warnings: [
        ...run.warnings,
        `Recovered snapshot with ${snapshot.artifacts.length} artifacts`,
      ],
      updatedAt:
        new Date().toISOString(),
      completedAt:
        new Date().toISOString(),
    };
  }
}
