import {
  randomUUID,
} from "node:crypto";
import {
  join,
  resolve,
} from "node:path";
import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenMetadata,
} from "../../core/codegen.contracts";
import {
  CodeGenPlanningEngine,
} from "../../planning/engine/codegen-planning-engine";
import {
  CodeGenPlanningPolicy,
} from "../../planning/contracts/codegen-planning.contracts";
import {
  CodeGenIncrementalRun,
  CodeGenIncrementalRunStatus,
} from "../contracts/codegen-incremental.contracts";
import {
  CodeGenIncrementalChangeDetector,
} from "../detection/codegen-incremental-change-detector";
import {
  CodeGenIncrementalPlanBuilder,
} from "../planning/codegen-incremental-plan-builder";
import {
  CodeGenIncrementalSnapshotFactory,
} from "../persistence/codegen-incremental-snapshot-factory";
import {
  CodeGenIncrementalSnapshotStore,
} from "../persistence/codegen-incremental-snapshot-store";
import {
  CodeGenIncrementalMetricsEngine,
} from "../metrics/codegen-incremental-metrics-engine";

export class CodeGenIncrementalRuntime {
  constructor(
    readonly planning =
      new CodeGenPlanningEngine(),
    readonly detector =
      new CodeGenIncrementalChangeDetector(),
    readonly planBuilder =
      new CodeGenIncrementalPlanBuilder(),
    readonly snapshotFactory =
      new CodeGenIncrementalSnapshotFactory(),
    readonly snapshotStore =
      new CodeGenIncrementalSnapshotStore(),
    readonly metrics =
      new CodeGenIncrementalMetricsEngine(),
  ) {}

  async execute(
    input: {
      workspaceRoot: string;
      targetRoot: string;
      artifacts:
        readonly CodeGenArtifactDescriptor[];
      metadata?:
        CodeGenMetadata;
      snapshotPath?: string;
    },
  ) {
    const startedAt =
      new Date().toISOString();

    const workspaceRoot =
      resolve(
        input.workspaceRoot,
      );

    const targetRoot =
      resolve(
        input.targetRoot,
      );

    const snapshotPath =
      input.snapshotPath ??
      join(
        targetRoot,
        ".avos-codegen",
        "incremental-snapshot.json",
      );

    let run:
      CodeGenIncrementalRun = {
      id:
        randomUUID(),
      status:
        CodeGenIncrementalRunStatus.CREATED,
      workspaceRoot,
      targetRoot,
      snapshotPath,
      changes: [],
      warnings: [],
      errors: [],
      createdAt:
        startedAt,
      updatedAt:
        startedAt,
    };

    try {
      const previous =
        await this.snapshotStore.load(
          snapshotPath,
        );

      run = {
        ...run,
        status:
          CodeGenIncrementalRunStatus.DETECTING,
        changes:
          this.detector.detect(
            input.artifacts,
            previous,
          ),
        updatedAt:
          new Date().toISOString(),
      };

      const planningResult =
        await this.planning.executeDefault({
          executionId:
            run.id,
          workspaceRoot,
          targetRoot,
          artifacts:
            [...input.artifacts],
          variables: {},
          metadata:
            input.metadata ?? {},
          policy:
            CodeGenPlanningPolicy.STRICT,
          createdAt:
            new Date().toISOString(),
        });

      if (
        !planningResult.success ||
        !planningResult.plan
      ) {
        throw new Error(
          planningResult.errors.join(
            "; ",
          ) ||
          "Incremental base planning failed",
        );
      }

      run = {
        ...run,
        status:
          CodeGenIncrementalRunStatus.PLANNING,
        plan:
          this.planBuilder.build(
            planningResult.plan,
            input.artifacts,
            run.changes,
          ),
        warnings: [
          ...run.warnings,
          ...planningResult.warnings,
        ],
        updatedAt:
          new Date().toISOString(),
      };

      const snapshot =
        this.snapshotFactory.create({
          workspaceRoot,
          targetRoot,
          artifacts:
            input.artifacts,
          executionPlan:
            planningResult.plan,
          metadata:
            input.metadata ?? {},
          ...(previous
            ? {
                previous,
              }
            : {}),
        });

      await this.snapshotStore.save(
        snapshotPath,
        snapshot,
      );

      run = {
        ...run,
        status:
          CodeGenIncrementalRunStatus.COMPLETED,
        updatedAt:
          new Date().toISOString(),
        completedAt:
          new Date().toISOString(),
      };

      return {
        run,
        snapshot,
        metrics:
          this.metrics.calculate(
            run,
            startedAt,
          ),
      };
    } catch (error) {
      run = {
        ...run,
        status:
          CodeGenIncrementalRunStatus.FAILED,
        errors: [
          ...run.errors,
          error instanceof Error
            ? error.message
            : String(error),
        ],
        updatedAt:
          new Date().toISOString(),
        completedAt:
          new Date().toISOString(),
      };

      return {
        run,
        snapshot:
          undefined,
        metrics:
          this.metrics.calculate(
            run,
            startedAt,
          ),
      };
    }
  }
}
