"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTestPresenceRule = void 0;
const codegen_quality_contracts_1 = require("../contracts/codegen-quality.contracts");
class CodeGenTestPresenceRule {
    descriptor = {
        key: "test-presence",
        name: "Test Presence Rule",
        description: "Requires generated services and controllers to have corresponding tests",
        category: codegen_quality_contracts_1.CodeGenQualityRuleCategory.TESTING,
        severity: codegen_quality_contracts_1.CodeGenQualitySeverity.WARNING,
        enabled: true,
        priority: 50,
        capabilities: [
            "test-presence-detection",
        ],
    };
    validate(context) {
        const path = context.artifact.relativePath;
        if (!path.endsWith(".service.ts") &&
            !path.endsWith(".controller.ts")) {
            return {
                ruleKey: this.descriptor.key,
                valid: true,
                issues: [],
                checkedAt: new Date().toISOString(),
            };
        }
        const testPath = path.replace(/\.ts$/, ".spec.ts");
        const exists = context.allArtifacts.some((artifact) => artifact.relativePath ===
            testPath);
        return {
            ruleKey: this.descriptor.key,
            valid: exists,
            issues: exists
                ? []
                : [
                    {
                        code: "GENERATED_TEST_MISSING",
                        category: this.descriptor.category,
                        severity: this.descriptor.severity,
                        message: `Generated test file is missing: ${testPath}`,
                        artifactKey: context.artifact.key,
                        relativePath: path,
                    },
                ],
            checkedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenTestPresenceRule = CodeGenTestPresenceRule;
//# sourceMappingURL=codegen-test-presence.rule.js.map