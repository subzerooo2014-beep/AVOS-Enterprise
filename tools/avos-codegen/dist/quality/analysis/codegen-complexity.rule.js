"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenComplexityRule = void 0;
const codegen_quality_contracts_1 = require("../contracts/codegen-quality.contracts");
const codegen_source_complexity_analyzer_1 = require("./codegen-source-complexity-analyzer");
class CodeGenComplexityRule {
    analyzer;
    descriptor = {
        key: "source-complexity",
        name: "Source Complexity Rule",
        description: "Detects generated source files with excessive estimated complexity",
        category: codegen_quality_contracts_1.CodeGenQualityRuleCategory.STRUCTURE,
        severity: codegen_quality_contracts_1.CodeGenQualitySeverity.WARNING,
        enabled: true,
        priority: 60,
        capabilities: [
            "complexity-analysis",
            "line-count-analysis",
        ],
    };
    constructor(analyzer = new codegen_source_complexity_analyzer_1.CodeGenSourceComplexityAnalyzer()) {
        this.analyzer = analyzer;
    }
    validate(context) {
        const complexity = this.analyzer.analyze(context.artifact.content);
        const issues = [];
        if (complexity.estimatedComplexity >
            25) {
            issues.push({
                code: "HIGH_GENERATED_COMPLEXITY",
                category: this.descriptor.category,
                severity: this.descriptor.severity,
                message: `Generated source complexity is high: ${complexity.estimatedComplexity}`,
                artifactKey: context.artifact.key,
                relativePath: context.artifact.relativePath,
                details: {
                    estimatedComplexity: complexity.estimatedComplexity,
                    lines: complexity.lines,
                },
            });
        }
        if (complexity.lines >
            800) {
            issues.push({
                code: "GENERATED_FILE_TOO_LARGE",
                category: this.descriptor.category,
                severity: this.descriptor.severity,
                message: `Generated source file is too large: ${complexity.lines} lines`,
                artifactKey: context.artifact.key,
                relativePath: context.artifact.relativePath,
            });
        }
        return {
            ruleKey: this.descriptor.key,
            valid: issues.length === 0,
            issues,
            checkedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenComplexityRule = CodeGenComplexityRule;
//# sourceMappingURL=codegen-complexity.rule.js.map