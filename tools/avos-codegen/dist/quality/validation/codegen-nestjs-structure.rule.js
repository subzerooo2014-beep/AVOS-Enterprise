"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenNestJsStructureRule = void 0;
const codegen_quality_contracts_1 = require("../contracts/codegen-quality.contracts");
class CodeGenNestJsStructureRule {
    descriptor = {
        key: "nestjs-structure",
        name: "NestJS Structure Rule",
        description: "Validates generated NestJS modules, controllers, and services",
        category: codegen_quality_contracts_1.CodeGenQualityRuleCategory.NESTJS,
        severity: codegen_quality_contracts_1.CodeGenQualitySeverity.ERROR,
        enabled: true,
        priority: 30,
        capabilities: [
            "module-validation",
            "controller-validation",
            "service-validation",
        ],
    };
    validate(context) {
        const path = context.artifact.relativePath;
        const content = context.artifact.content;
        const issues = [];
        if (path.endsWith(".module.ts")) {
            if (!content.includes("@Module(")) {
                issues.push({
                    code: "NESTJS_MODULE_DECORATOR_MISSING",
                    category: this.descriptor.category,
                    severity: this.descriptor.severity,
                    message: "NestJS module file must include @Module decorator",
                    artifactKey: context.artifact.key,
                    relativePath: path,
                });
            }
            if (!content.includes("export class")) {
                issues.push({
                    code: "NESTJS_MODULE_CLASS_MISSING",
                    category: this.descriptor.category,
                    severity: this.descriptor.severity,
                    message: "NestJS module file must export a class",
                    artifactKey: context.artifact.key,
                    relativePath: path,
                });
            }
        }
        if (path.endsWith(".controller.ts") &&
            !content.includes("@Controller(")) {
            issues.push({
                code: "NESTJS_CONTROLLER_DECORATOR_MISSING",
                category: this.descriptor.category,
                severity: this.descriptor.severity,
                message: "NestJS controller file must include @Controller decorator",
                artifactKey: context.artifact.key,
                relativePath: path,
            });
        }
        if (path.endsWith(".service.ts") &&
            !content.includes("@Injectable(") &&
            !content.includes("@Injectable()")) {
            issues.push({
                code: "NESTJS_SERVICE_INJECTABLE_MISSING",
                category: this.descriptor.category,
                severity: this.descriptor.severity,
                message: "NestJS service file must include @Injectable decorator",
                artifactKey: context.artifact.key,
                relativePath: path,
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
exports.CodeGenNestJsStructureRule = CodeGenNestJsStructureRule;
//# sourceMappingURL=codegen-nestjs-structure.rule.js.map