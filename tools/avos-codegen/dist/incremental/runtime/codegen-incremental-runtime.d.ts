import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenMetadata } from "../../core/codegen.contracts";
import { CodeGenPlanningEngine } from "../../planning/engine/codegen-planning-engine";
import { CodeGenIncrementalRun } from "../contracts/codegen-incremental.contracts";
import { CodeGenIncrementalChangeDetector } from "../detection/codegen-incremental-change-detector";
import { CodeGenIncrementalPlanBuilder } from "../planning/codegen-incremental-plan-builder";
import { CodeGenIncrementalSnapshotFactory } from "../persistence/codegen-incremental-snapshot-factory";
import { CodeGenIncrementalSnapshotStore } from "../persistence/codegen-incremental-snapshot-store";
import { CodeGenIncrementalMetricsEngine } from "../metrics/codegen-incremental-metrics-engine";
export declare class CodeGenIncrementalRuntime {
    readonly planning: CodeGenPlanningEngine;
    readonly detector: CodeGenIncrementalChangeDetector;
    readonly planBuilder: CodeGenIncrementalPlanBuilder;
    readonly snapshotFactory: CodeGenIncrementalSnapshotFactory;
    readonly snapshotStore: CodeGenIncrementalSnapshotStore;
    readonly metrics: CodeGenIncrementalMetricsEngine;
    constructor(planning?: CodeGenPlanningEngine, detector?: CodeGenIncrementalChangeDetector, planBuilder?: CodeGenIncrementalPlanBuilder, snapshotFactory?: CodeGenIncrementalSnapshotFactory, snapshotStore?: CodeGenIncrementalSnapshotStore, metrics?: CodeGenIncrementalMetricsEngine);
    execute(input: {
        workspaceRoot: string;
        targetRoot: string;
        artifacts: readonly CodeGenArtifactDescriptor[];
        metadata?: CodeGenMetadata;
        snapshotPath?: string;
    }): Promise<{
        run: CodeGenIncrementalRun;
        snapshot: import("../contracts/codegen-incremental.contracts").CodeGenIncrementalSnapshot;
        metrics: import("../contracts/codegen-incremental.contracts").CodeGenIncrementalMetrics;
    } | {
        run: CodeGenIncrementalRun;
        snapshot: undefined;
        metrics: import("../contracts/codegen-incremental.contracts").CodeGenIncrementalMetrics;
    }>;
}
//# sourceMappingURL=codegen-incremental-runtime.d.ts.map