"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenDuplicateImportRule = void 0;
const codegen_quality_contracts_1 = require("../contracts/codegen-quality.contracts");
const codegen_import_analyzer_1 = require("./codegen-import-analyzer");
class CodeGenDuplicateImportRule {
    analyzer;
    descriptor = {
        key: "duplicate-imports",
        name: "Duplicate Imports Rule",
        description: "Detects repeated imports from the same module",
        category: codegen_quality_contracts_1.CodeGenQualityRuleCategory.IMPORTS,
        severity: codegen_quality_contracts_1.CodeGenQualitySeverity.WARNING,
        enabled: true,
        priority: 20,
        capabilities: [
            "duplicate-import-detection",
        ],
    };
    constructor(analyzer = new codegen_import_analyzer_1.CodeGenImportAnalyzer()) {
        this.analyzer = analyzer;
    }
    validate(context) {
        const records = this.analyzer.analyze(context.artifact.content);
        const groups = new Map();
        for (const record of records) {
            const group = groups.get(record.source) ?? [];
            group.push(record);
            groups.set(record.source, group);
        }
        const duplicates = Array.from(groups.entries())
            .filter(([, group]) => group.length > 1);
        const issues = duplicates.map(([source, group]) => {
            const firstLine = group[0]?.line;
            return {
                code: "DUPLICATE_IMPORT_SOURCE",
                category: this.descriptor.category,
                severity: this.descriptor.severity,
                message: `Duplicate imports from ${source}`,
                artifactKey: context.artifact.key,
                relativePath: context.artifact.relativePath,
                ...(firstLine !==
                    undefined
                    ? {
                        line: firstLine,
                    }
                    : {}),
            };
        });
        return {
            ruleKey: this.descriptor.key,
            valid: duplicates.length ===
                0,
            issues,
            checkedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenDuplicateImportRule = CodeGenDuplicateImportRule;
//# sourceMappingURL=codegen-duplicate-import.rule.js.map