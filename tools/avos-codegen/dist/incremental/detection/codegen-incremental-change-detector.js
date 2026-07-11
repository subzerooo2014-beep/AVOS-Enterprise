"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenIncrementalChangeDetector = void 0;
const codegen_incremental_contracts_1 = require("../contracts/codegen-incremental.contracts");
const codegen_artifact_state_factory_1 = require("./codegen-artifact-state-factory");
class CodeGenIncrementalChangeDetector {
    states;
    constructor(states = new codegen_artifact_state_factory_1.CodeGenArtifactStateFactory()) {
        this.states = states;
    }
    detect(artifacts, snapshot) {
        const currentStates = this.states.createMany(artifacts);
        const previousByKey = new Map((snapshot?.artifacts ?? [])
            .map((state) => [
            state.artifactKey,
            state,
        ]));
        const currentByKey = new Map(currentStates.map((state) => [
            state.artifactKey,
            state,
        ]));
        const changes = [];
        for (const current of currentStates) {
            const previous = previousByKey.get(current.artifactKey);
            if (!previous) {
                changes.push({
                    artifactKey: current.artifactKey,
                    relativePath: current.relativePath,
                    type: codegen_incremental_contracts_1.CodeGenArtifactChangeType.CREATED,
                    current,
                    reason: "Artifact does not exist in previous snapshot",
                    detectedAt: new Date().toISOString(),
                });
                continue;
            }
            if (previous.relativePath !==
                current.relativePath) {
                changes.push({
                    artifactKey: current.artifactKey,
                    relativePath: current.relativePath,
                    type: codegen_incremental_contracts_1.CodeGenArtifactChangeType.MOVED,
                    previous,
                    current,
                    reason: "Artifact target path changed",
                    detectedAt: new Date().toISOString(),
                });
                continue;
            }
            if (previous.checksum !==
                current.checksum) {
                changes.push({
                    artifactKey: current.artifactKey,
                    relativePath: current.relativePath,
                    type: codegen_incremental_contracts_1.CodeGenArtifactChangeType.MODIFIED,
                    previous,
                    current,
                    reason: "Artifact checksum changed",
                    detectedAt: new Date().toISOString(),
                });
                continue;
            }
            changes.push({
                artifactKey: current.artifactKey,
                relativePath: current.relativePath,
                type: codegen_incremental_contracts_1.CodeGenArtifactChangeType.UNCHANGED,
                previous,
                current,
                reason: "Artifact checksum and path are unchanged",
                detectedAt: new Date().toISOString(),
            });
        }
        for (const previous of snapshot?.artifacts ?? []) {
            if (currentByKey.has(previous.artifactKey)) {
                continue;
            }
            changes.push({
                artifactKey: previous.artifactKey,
                relativePath: previous.relativePath,
                type: codegen_incremental_contracts_1.CodeGenArtifactChangeType.DELETED,
                previous,
                reason: "Artifact no longer exists in current generation set",
                detectedAt: new Date().toISOString(),
            });
        }
        return changes.sort((left, right) => left.artifactKey.localeCompare(right.artifactKey));
    }
}
exports.CodeGenIncrementalChangeDetector = CodeGenIncrementalChangeDetector;
//# sourceMappingURL=codegen-incremental-change-detector.js.map