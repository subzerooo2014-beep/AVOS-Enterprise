"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenIncrementalRunStatus = exports.CodeGenRegenerationDecision = exports.CodeGenArtifactChangeType = void 0;
var CodeGenArtifactChangeType;
(function (CodeGenArtifactChangeType) {
    CodeGenArtifactChangeType["CREATED"] = "created";
    CodeGenArtifactChangeType["MODIFIED"] = "modified";
    CodeGenArtifactChangeType["UNCHANGED"] = "unchanged";
    CodeGenArtifactChangeType["DELETED"] = "deleted";
    CodeGenArtifactChangeType["MOVED"] = "moved";
    CodeGenArtifactChangeType["CONFLICTED"] = "conflicted";
})(CodeGenArtifactChangeType || (exports.CodeGenArtifactChangeType = CodeGenArtifactChangeType = {}));
var CodeGenRegenerationDecision;
(function (CodeGenRegenerationDecision) {
    CodeGenRegenerationDecision["GENERATE"] = "generate";
    CodeGenRegenerationDecision["REGENERATE"] = "regenerate";
    CodeGenRegenerationDecision["SKIP"] = "skip";
    CodeGenRegenerationDecision["DELETE"] = "delete";
    CodeGenRegenerationDecision["CONFLICT"] = "conflict";
})(CodeGenRegenerationDecision || (exports.CodeGenRegenerationDecision = CodeGenRegenerationDecision = {}));
var CodeGenIncrementalRunStatus;
(function (CodeGenIncrementalRunStatus) {
    CodeGenIncrementalRunStatus["CREATED"] = "created";
    CodeGenIncrementalRunStatus["DETECTING"] = "detecting";
    CodeGenIncrementalRunStatus["PLANNING"] = "planning";
    CodeGenIncrementalRunStatus["EXECUTING"] = "executing";
    CodeGenIncrementalRunStatus["COMPLETED"] = "completed";
    CodeGenIncrementalRunStatus["FAILED"] = "failed";
    CodeGenIncrementalRunStatus["RECOVERED"] = "recovered";
})(CodeGenIncrementalRunStatus || (exports.CodeGenIncrementalRunStatus = CodeGenIncrementalRunStatus = {}));
//# sourceMappingURL=codegen-incremental.contracts.js.map