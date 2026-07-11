"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenIncrementalRuntime = void 0;
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const codegen_planning_engine_1 = require("../../planning/engine/codegen-planning-engine");
const codegen_planning_contracts_1 = require("../../planning/contracts/codegen-planning.contracts");
const codegen_incremental_contracts_1 = require("../contracts/codegen-incremental.contracts");
const codegen_incremental_change_detector_1 = require("../detection/codegen-incremental-change-detector");
const codegen_incremental_plan_builder_1 = require("../planning/codegen-incremental-plan-builder");
const codegen_incremental_snapshot_factory_1 = require("../persistence/codegen-incremental-snapshot-factory");
const codegen_incremental_snapshot_store_1 = require("../persistence/codegen-incremental-snapshot-store");
const codegen_incremental_metrics_engine_1 = require("../metrics/codegen-incremental-metrics-engine");
class CodeGenIncrementalRuntime {
    planning;
    detector;
    planBuilder;
    snapshotFactory;
    snapshotStore;
    metrics;
    constructor(planning = new codegen_planning_engine_1.CodeGenPlanningEngine(), detector = new codegen_incremental_change_detector_1.CodeGenIncrementalChangeDetector(), planBuilder = new codegen_incremental_plan_builder_1.CodeGenIncrementalPlanBuilder(), snapshotFactory = new codegen_incremental_snapshot_factory_1.CodeGenIncrementalSnapshotFactory(), snapshotStore = new codegen_incremental_snapshot_store_1.CodeGenIncrementalSnapshotStore(), metrics = new codegen_incremental_metrics_engine_1.CodeGenIncrementalMetricsEngine()) {
        this.planning = planning;
        this.detector = detector;
        this.planBuilder = planBuilder;
        this.snapshotFactory = snapshotFactory;
        this.snapshotStore = snapshotStore;
        this.metrics = metrics;
    }
    async execute(input) {
        const startedAt = new Date().toISOString();
        const workspaceRoot = (0, node_path_1.resolve)(input.workspaceRoot);
        const targetRoot = (0, node_path_1.resolve)(input.targetRoot);
        const snapshotPath = input.snapshotPath ??
            (0, node_path_1.join)(targetRoot, ".avos-codegen", "incremental-snapshot.json");
        let run = {
            id: (0, node_crypto_1.randomUUID)(),
            status: codegen_incremental_contracts_1.CodeGenIncrementalRunStatus.CREATED,
            workspaceRoot,
            targetRoot,
            snapshotPath,
            changes: [],
            warnings: [],
            errors: [],
            createdAt: startedAt,
            updatedAt: startedAt,
        };
        try {
            const previous = await this.snapshotStore.load(snapshotPath);
            run = {
                ...run,
                status: codegen_incremental_contracts_1.CodeGenIncrementalRunStatus.DETECTING,
                changes: this.detector.detect(input.artifacts, previous),
                updatedAt: new Date().toISOString(),
            };
            const planningResult = await this.planning.executeDefault({
                executionId: run.id,
                workspaceRoot,
                targetRoot,
                artifacts: [...input.artifacts],
                variables: {},
                metadata: input.metadata ?? {},
                policy: codegen_planning_contracts_1.CodeGenPlanningPolicy.STRICT,
                createdAt: new Date().toISOString(),
            });
            if (!planningResult.success ||
                !planningResult.plan) {
                throw new Error(planningResult.errors.join("; ") ||
                    "Incremental base planning failed");
            }
            run = {
                ...run,
                status: codegen_incremental_contracts_1.CodeGenIncrementalRunStatus.PLANNING,
                plan: this.planBuilder.build(planningResult.plan, input.artifacts, run.changes),
                warnings: [
                    ...run.warnings,
                    ...planningResult.warnings,
                ],
                updatedAt: new Date().toISOString(),
            };
            const snapshot = this.snapshotFactory.create({
                workspaceRoot,
                targetRoot,
                artifacts: input.artifacts,
                executionPlan: planningResult.plan,
                metadata: input.metadata ?? {},
                ...(previous
                    ? {
                        previous,
                    }
                    : {}),
            });
            await this.snapshotStore.save(snapshotPath, snapshot);
            run = {
                ...run,
                status: codegen_incremental_contracts_1.CodeGenIncrementalRunStatus.COMPLETED,
                updatedAt: new Date().toISOString(),
                completedAt: new Date().toISOString(),
            };
            return {
                run,
                snapshot,
                metrics: this.metrics.calculate(run, startedAt),
            };
        }
        catch (error) {
            run = {
                ...run,
                status: codegen_incremental_contracts_1.CodeGenIncrementalRunStatus.FAILED,
                errors: [
                    ...run.errors,
                    error instanceof Error
                        ? error.message
                        : String(error),
                ],
                updatedAt: new Date().toISOString(),
                completedAt: new Date().toISOString(),
            };
            return {
                run,
                snapshot: undefined,
                metrics: this.metrics.calculate(run, startedAt),
            };
        }
    }
}
exports.CodeGenIncrementalRuntime = CodeGenIncrementalRuntime;
//# sourceMappingURL=codegen-incremental-runtime.js.map