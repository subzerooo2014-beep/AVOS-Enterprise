"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenEnterpriseSessionMode = exports.CodeGenEnterpriseSessionStatus = void 0;
var CodeGenEnterpriseSessionStatus;
(function (CodeGenEnterpriseSessionStatus) {
    CodeGenEnterpriseSessionStatus["CREATED"] = "created";
    CodeGenEnterpriseSessionStatus["INITIALIZING"] = "initializing";
    CodeGenEnterpriseSessionStatus["READY"] = "ready";
    CodeGenEnterpriseSessionStatus["PLANNING"] = "planning";
    CodeGenEnterpriseSessionStatus["SCHEDULING"] = "scheduling";
    CodeGenEnterpriseSessionStatus["EXECUTING"] = "executing";
    CodeGenEnterpriseSessionStatus["VALIDATING"] = "validating";
    CodeGenEnterpriseSessionStatus["COMMITTING"] = "committing";
    CodeGenEnterpriseSessionStatus["COMPLETED"] = "completed";
    CodeGenEnterpriseSessionStatus["FAILED"] = "failed";
    CodeGenEnterpriseSessionStatus["CANCELLED"] = "cancelled";
    CodeGenEnterpriseSessionStatus["ROLLING_BACK"] = "rolling_back";
    CodeGenEnterpriseSessionStatus["ROLLED_BACK"] = "rolled_back";
})(CodeGenEnterpriseSessionStatus || (exports.CodeGenEnterpriseSessionStatus = CodeGenEnterpriseSessionStatus = {}));
var CodeGenEnterpriseSessionMode;
(function (CodeGenEnterpriseSessionMode) {
    CodeGenEnterpriseSessionMode["PREVIEW"] = "preview";
    CodeGenEnterpriseSessionMode["GENERATE"] = "generate";
    CodeGenEnterpriseSessionMode["REGENERATE"] = "regenerate";
    CodeGenEnterpriseSessionMode["RECOVER"] = "recover";
})(CodeGenEnterpriseSessionMode || (exports.CodeGenEnterpriseSessionMode = CodeGenEnterpriseSessionMode = {}));
//# sourceMappingURL=codegen-enterprise-runtime.contracts.js.map