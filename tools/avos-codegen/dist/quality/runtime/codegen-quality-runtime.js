"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenQualityRuntime = void 0;
const codegen_complexity_rule_1 = require("../analysis/codegen-complexity.rule");
const codegen_duplicate_import_rule_1 = require("../imports/codegen-duplicate-import.rule");
const codegen_file_naming_rule_1 = require("../naming/codegen-file-naming.rule");
const codegen_dto_validation_rule_1 = require("../validation/codegen-dto-validation.rule");
const codegen_nestjs_structure_rule_1 = require("../validation/codegen-nestjs-structure.rule");
const codegen_quality_rule_registry_1 = require("../validation/codegen-quality-rule-registry");
const codegen_test_presence_rule_1 = require("../validation/codegen-test-presence.rule");
const codegen_quality_report_builder_1 = require("../reports/codegen-quality-report-builder");
class CodeGenQualityRuntime {
    registry;
    reports;
    constructor(registry = new codegen_quality_rule_registry_1.CodeGenQualityRuleRegistry(), reports = new codegen_quality_report_builder_1.CodeGenQualityReportBuilder()) {
        this.registry = registry;
        this.reports = reports;
        if (this.registry.list()
            .length === 0) {
            this.registerDefaults();
        }
    }
    async execute(artifacts, metadata = {}) {
        const startedAt = new Date().toISOString();
        const results = [];
        for (const artifact of artifacts) {
            for (const rule of this.registry.list()) {
                results.push(await rule.validate({
                    artifact,
                    allArtifacts: artifacts,
                    metadata,
                }));
            }
        }
        return this.reports.build({
            artifacts: artifacts.length,
            results,
            metadata,
            startedAt,
        });
    }
    registerDefaults() {
        const rules = [
            new codegen_file_naming_rule_1.CodeGenFileNamingRule(),
            new codegen_duplicate_import_rule_1.CodeGenDuplicateImportRule(),
            new codegen_nestjs_structure_rule_1.CodeGenNestJsStructureRule(),
            new codegen_dto_validation_rule_1.CodeGenDtoValidationRule(),
            new codegen_test_presence_rule_1.CodeGenTestPresenceRule(),
            new codegen_complexity_rule_1.CodeGenComplexityRule(),
        ];
        for (const rule of rules) {
            this.registry.register(rule);
        }
    }
}
exports.CodeGenQualityRuntime = CodeGenQualityRuntime;
//# sourceMappingURL=codegen-quality-runtime.js.map