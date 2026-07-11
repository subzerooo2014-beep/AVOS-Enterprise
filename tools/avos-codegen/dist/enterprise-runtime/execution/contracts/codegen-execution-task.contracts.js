"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenExecutionTaskType = exports.CodeGenExecutionTaskStatus = void 0;
var CodeGenExecutionTaskStatus;
(function (CodeGenExecutionTaskStatus) {
    CodeGenExecutionTaskStatus["CREATED"] = "created";
    CodeGenExecutionTaskStatus["QUEUED"] = "queued";
    CodeGenExecutionTaskStatus["DISPATCHED"] = "dispatched";
    CodeGenExecutionTaskStatus["RUNNING"] = "running";
    CodeGenExecutionTaskStatus["SUCCEEDED"] = "succeeded";
    CodeGenExecutionTaskStatus["FAILED"] = "failed";
    CodeGenExecutionTaskStatus["CANCELLED"] = "cancelled";
    CodeGenExecutionTaskStatus["SKIPPED"] = "skipped";
})(CodeGenExecutionTaskStatus || (exports.CodeGenExecutionTaskStatus = CodeGenExecutionTaskStatus = {}));
var CodeGenExecutionTaskType;
(function (CodeGenExecutionTaskType) {
    CodeGenExecutionTaskType["GENERATE"] = "generate";
    CodeGenExecutionTaskType["VALIDATE"] = "validate";
    CodeGenExecutionTaskType["WRITE"] = "write";
    CodeGenExecutionTaskType["TRANSFORM"] = "transform";
    CodeGenExecutionTaskType["CUSTOM"] = "custom";
})(CodeGenExecutionTaskType || (exports.CodeGenExecutionTaskType = CodeGenExecutionTaskType = {}));
//# sourceMappingURL=codegen-execution-task.contracts.js.map