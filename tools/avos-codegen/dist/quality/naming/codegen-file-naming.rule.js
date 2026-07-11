"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenFileNamingRule = void 0;
const codegen_quality_contracts_1 = require("../contracts/codegen-quality.contracts");
const codegen_naming_utilities_1 = require("./codegen-naming.utilities");
class CodeGenFileNamingRule {
    descriptor = {
        key: "file-naming",
        name: "File Naming Rule",
        description: "Ensures generated source filenames use kebab-case",
        category: codegen_quality_contracts_1.CodeGenQualityRuleCategory.NAMING,
        severity: codegen_quality_contracts_1.CodeGenQualitySeverity.ERROR,
        enabled: true,
        priority: 10,
        capabilities: [
            "filename-validation",
            "kebab-case-validation",
        ],
    };
    validate(context) {
        const filename = (0, codegen_naming_utilities_1.pathFilename)(context.artifact.relativePath);
        const base = (0, codegen_naming_utilities_1.filenameWithoutExtensions)(filename)
            .replace(/\.(controller|service|module|spec|test|dto|manifest)$/, "");
        const valid = !filename ||
            (0, codegen_naming_utilities_1.isKebabCase)(base);
        return {
            ruleKey: this.descriptor.key,
            valid,
            issues: valid
                ? []
                : [
                    {
                        code: "INVALID_FILE_NAMING",
                        category: this.descriptor.category,
                        severity: this.descriptor.severity,
                        message: `Generated filename must use kebab-case: ${filename}`,
                        artifactKey: context.artifact.key,
                        relativePath: context.artifact.relativePath,
                    },
                ],
            checkedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenFileNamingRule = CodeGenFileNamingRule;
//# sourceMappingURL=codegen-file-naming.rule.js.map