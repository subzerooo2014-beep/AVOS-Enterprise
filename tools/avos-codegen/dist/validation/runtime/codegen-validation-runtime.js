"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenValidationRuntime = void 0;
const codegen_blueprint_validation_rule_1 = require("../blueprints/codegen-blueprint-validation.rule");
const codegen_compliance_validation_rule_1 = require("../compliance/codegen-compliance-validation.rule");
const codegen_generation_policy_rule_1 = require("../policies/codegen-generation-policy.rule");
const codegen_validation_registry_1 = require("../registry/codegen-validation-registry");
const codegen_validation_report_builder_1 = require("../reports/codegen-validation-report-builder");
const codegen_security_validation_rule_1 = require("../security/codegen-security-validation.rule");
const codegen_template_validation_rule_1 = require("../templates/codegen-template-validation.rule");
const codegen_variable_schema_validation_rule_1 = require("../variables/codegen-variable-schema-validation.rule");
const codegen_validation_health_analyzer_1 = require("../health/codegen-validation-health-analyzer");
class CodeGenValidationRuntime {
    registry;
    reports;
    health;
    constructor(registry = new codegen_validation_registry_1.CodeGenValidationRegistry(), reports = new codegen_validation_report_builder_1.CodeGenValidationReportBuilder(), health = new codegen_validation_health_analyzer_1.CodeGenValidationHealthAnalyzer()) {
        this.registry = registry;
        this.reports = reports;
        this.health = health;
        if (this.registry.list()
            .length === 0) {
            this.registerDefaults();
        }
    }
    async execute(context, metadata = {}) {
        const startedAt = new Date().toISOString();
        const results = [];
        for (const rule of this.registry.list()) {
            results.push(await rule.validate(context));
        }
        const report = this.reports.build({
            results,
            metadata: {
                ...context.metadata,
                ...metadata,
            },
            startedAt,
        });
        return {
            report,
            health: this.health.analyze(report.issues),
        };
    }
    registerDefaults() {
        const rules = [
            new codegen_blueprint_validation_rule_1.CodeGenBlueprintValidationRule(),
            new codegen_template_validation_rule_1.CodeGenTemplateValidationRule(),
            new codegen_variable_schema_validation_rule_1.CodeGenVariableSchemaValidationRule(),
            new codegen_generation_policy_rule_1.CodeGenGenerationPolicyRule(),
            new codegen_security_validation_rule_1.CodeGenSecurityValidationRule(),
            new codegen_compliance_validation_rule_1.CodeGenComplianceValidationRule(),
        ];
        for (const rule of rules) {
            this.registry.register(rule);
        }
    }
}
exports.CodeGenValidationRuntime = CodeGenValidationRuntime;
//# sourceMappingURL=codegen-validation-runtime.js.map