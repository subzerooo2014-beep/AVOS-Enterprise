"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenPlanningPolicy = exports.CodeGenExecutionStageType = exports.CodeGenPlanningStatus = void 0;
var CodeGenPlanningStatus;
(function (CodeGenPlanningStatus) {
    CodeGenPlanningStatus["CREATED"] = "created";
    CodeGenPlanningStatus["VALIDATING"] = "validating";
    CodeGenPlanningStatus["READY"] = "ready";
    CodeGenPlanningStatus["PLANNING"] = "planning";
    CodeGenPlanningStatus["COMPLETED"] = "completed";
    CodeGenPlanningStatus["FAILED"] = "failed";
})(CodeGenPlanningStatus || (exports.CodeGenPlanningStatus = CodeGenPlanningStatus = {}));
var CodeGenExecutionStageType;
(function (CodeGenExecutionStageType) {
    CodeGenExecutionStageType["SERIAL"] = "serial";
    CodeGenExecutionStageType["PARALLEL"] = "parallel";
    CodeGenExecutionStageType["BARRIER"] = "barrier";
})(CodeGenExecutionStageType || (exports.CodeGenExecutionStageType = CodeGenExecutionStageType = {}));
var CodeGenPlanningPolicy;
(function (CodeGenPlanningPolicy) {
    CodeGenPlanningPolicy["STRICT"] = "strict";
    CodeGenPlanningPolicy["BEST_EFFORT"] = "best_effort";
    CodeGenPlanningPolicy["FAIL_FAST"] = "fail_fast";
})(CodeGenPlanningPolicy || (exports.CodeGenPlanningPolicy = CodeGenPlanningPolicy = {}));
//# sourceMappingURL=codegen-planning.contracts.js.map