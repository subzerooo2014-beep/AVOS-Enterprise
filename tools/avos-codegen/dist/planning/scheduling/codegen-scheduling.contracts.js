"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenConcurrencyMode = exports.CodeGenScheduleItemStatus = void 0;
var CodeGenScheduleItemStatus;
(function (CodeGenScheduleItemStatus) {
    CodeGenScheduleItemStatus["PENDING"] = "pending";
    CodeGenScheduleItemStatus["READY"] = "ready";
    CodeGenScheduleItemStatus["RUNNING"] = "running";
    CodeGenScheduleItemStatus["SUCCEEDED"] = "succeeded";
    CodeGenScheduleItemStatus["FAILED"] = "failed";
    CodeGenScheduleItemStatus["SKIPPED"] = "skipped";
    CodeGenScheduleItemStatus["RETRYING"] = "retrying";
})(CodeGenScheduleItemStatus || (exports.CodeGenScheduleItemStatus = CodeGenScheduleItemStatus = {}));
var CodeGenConcurrencyMode;
(function (CodeGenConcurrencyMode) {
    CodeGenConcurrencyMode["SERIAL"] = "serial";
    CodeGenConcurrencyMode["BOUNDED"] = "bounded";
    CodeGenConcurrencyMode["UNBOUNDED"] = "unbounded";
})(CodeGenConcurrencyMode || (exports.CodeGenConcurrencyMode = CodeGenConcurrencyMode = {}));
//# sourceMappingURL=codegen-scheduling.contracts.js.map