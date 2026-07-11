"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenQualityRuleCategory = exports.CodeGenQualitySeverity = void 0;
var CodeGenQualitySeverity;
(function (CodeGenQualitySeverity) {
    CodeGenQualitySeverity["INFORMATIONAL"] = "informational";
    CodeGenQualitySeverity["WARNING"] = "warning";
    CodeGenQualitySeverity["ERROR"] = "error";
    CodeGenQualitySeverity["CRITICAL"] = "critical";
})(CodeGenQualitySeverity || (exports.CodeGenQualitySeverity = CodeGenQualitySeverity = {}));
var CodeGenQualityRuleCategory;
(function (CodeGenQualityRuleCategory) {
    CodeGenQualityRuleCategory["STRUCTURE"] = "structure";
    CodeGenQualityRuleCategory["NAMING"] = "naming";
    CodeGenQualityRuleCategory["IMPORTS"] = "imports";
    CodeGenQualityRuleCategory["NESTJS"] = "nestjs";
    CodeGenQualityRuleCategory["DTO"] = "dto";
    CodeGenQualityRuleCategory["PRISMA"] = "prisma";
    CodeGenQualityRuleCategory["TESTING"] = "testing";
    CodeGenQualityRuleCategory["DOCUMENTATION"] = "documentation";
    CodeGenQualityRuleCategory["SECURITY"] = "security";
    CodeGenQualityRuleCategory["CUSTOM"] = "custom";
})(CodeGenQualityRuleCategory || (exports.CodeGenQualityRuleCategory = CodeGenQualityRuleCategory = {}));
//# sourceMappingURL=codegen-quality.contracts.js.map