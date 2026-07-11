"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenValidationCategory = exports.CodeGenValidationSeverity = void 0;
var CodeGenValidationSeverity;
(function (CodeGenValidationSeverity) {
    CodeGenValidationSeverity["INFORMATIONAL"] = "informational";
    CodeGenValidationSeverity["WARNING"] = "warning";
    CodeGenValidationSeverity["ERROR"] = "error";
    CodeGenValidationSeverity["CRITICAL"] = "critical";
})(CodeGenValidationSeverity || (exports.CodeGenValidationSeverity = CodeGenValidationSeverity = {}));
var CodeGenValidationCategory;
(function (CodeGenValidationCategory) {
    CodeGenValidationCategory["BLUEPRINT"] = "blueprint";
    CodeGenValidationCategory["TEMPLATE"] = "template";
    CodeGenValidationCategory["VARIABLES"] = "variables";
    CodeGenValidationCategory["DEPENDENCY"] = "dependency";
    CodeGenValidationCategory["COMPATIBILITY"] = "compatibility";
    CodeGenValidationCategory["POLICY"] = "policy";
    CodeGenValidationCategory["SECURITY"] = "security";
    CodeGenValidationCategory["COMPLIANCE"] = "compliance";
    CodeGenValidationCategory["HEALTH"] = "health";
})(CodeGenValidationCategory || (exports.CodeGenValidationCategory = CodeGenValidationCategory = {}));
//# sourceMappingURL=codegen-validation.contracts.js.map