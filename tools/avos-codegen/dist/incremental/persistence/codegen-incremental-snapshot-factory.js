"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenIncrementalSnapshotFactory = void 0;
const codegen_artifact_state_factory_1 = require("../detection/codegen-artifact-state-factory");
class CodeGenIncrementalSnapshotFactory {
    states;
    constructor(states = new codegen_artifact_state_factory_1.CodeGenArtifactStateFactory()) {
        this.states = states;
    }
    create(input) {
        const now = new Date().toISOString();
        return {
            version: "1.0.0",
            workspaceRoot: input.workspaceRoot,
            targetRoot: input.targetRoot,
            artifacts: this.states.createMany(input.artifacts),
            ...(input.executionPlan
                ? {
                    executionPlan: structuredClone(input.executionPlan),
                }
                : {}),
            metadata: structuredClone(input.metadata ?? {}),
            createdAt: input.previous
                ?.createdAt ??
                now,
            updatedAt: now,
        };
    }
}
exports.CodeGenIncrementalSnapshotFactory = CodeGenIncrementalSnapshotFactory;
//# sourceMappingURL=codegen-incremental-snapshot-factory.js.map