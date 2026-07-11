"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTransactionOperationType = exports.CodeGenGenerationSessionStatus = void 0;
var CodeGenGenerationSessionStatus;
(function (CodeGenGenerationSessionStatus) {
    CodeGenGenerationSessionStatus["CREATED"] = "created";
    CodeGenGenerationSessionStatus["PLANNING"] = "planning";
    CodeGenGenerationSessionStatus["READY"] = "ready";
    CodeGenGenerationSessionStatus["RUNNING"] = "running";
    CodeGenGenerationSessionStatus["COMMITTING"] = "committing";
    CodeGenGenerationSessionStatus["COMMITTED"] = "committed";
    CodeGenGenerationSessionStatus["ROLLING_BACK"] = "rolling_back";
    CodeGenGenerationSessionStatus["ROLLED_BACK"] = "rolled_back";
    CodeGenGenerationSessionStatus["FAILED"] = "failed";
})(CodeGenGenerationSessionStatus || (exports.CodeGenGenerationSessionStatus = CodeGenGenerationSessionStatus = {}));
var CodeGenTransactionOperationType;
(function (CodeGenTransactionOperationType) {
    CodeGenTransactionOperationType["CREATE_FILE"] = "create_file";
    CodeGenTransactionOperationType["UPDATE_FILE"] = "update_file";
    CodeGenTransactionOperationType["SKIP_FILE"] = "skip_file";
    CodeGenTransactionOperationType["DELETE_FILE"] = "delete_file";
    CodeGenTransactionOperationType["RESTORE_FILE"] = "restore_file";
})(CodeGenTransactionOperationType || (exports.CodeGenTransactionOperationType = CodeGenTransactionOperationType = {}));
//# sourceMappingURL=codegen-generation.contracts.js.map