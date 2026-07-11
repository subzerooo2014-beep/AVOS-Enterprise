"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenDefaultPlanner = void 0;
const codegen_execution_plan_builder_1 = require("../builders/codegen-execution-plan-builder");
const codegen_planning_validator_1 = require("../validation/codegen-planning-validator");
class CodeGenDefaultPlanner {
    validator;
    builder;
    descriptor = {
        key: "default-planner",
        name: "Default Generation Planner",
        description: "Creates ordered execution stages for CodeGen artifacts",
        version: "1.0.0-alpha.1",
        priority: 100,
        enabled: true,
        capabilities: [
            "artifact-ordering",
            "stage-planning",
            "dependency-validation",
            "parallel-stage-detection",
        ],
    };
    constructor(validator = new codegen_planning_validator_1.CodeGenPlanningValidator(), builder = new codegen_execution_plan_builder_1.CodeGenExecutionPlanBuilder()) {
        this.validator = validator;
        this.builder = builder;
    }
    plan(context) {
        const diagnostics = this.validator.validate(context);
        const errors = diagnostics
            .filter((diagnostic) => diagnostic.severity ===
            "error" ||
            diagnostic.severity ===
                "critical")
            .map((diagnostic) => diagnostic.message);
        const warnings = diagnostics
            .filter((diagnostic) => diagnostic.severity ===
            "warning")
            .map((diagnostic) => diagnostic.message);
        if (errors.length > 0) {
            return {
                success: false,
                diagnostics,
                warnings,
                errors,
                generatedAt: new Date().toISOString(),
            };
        }
        const plan = this.builder.build(context);
        plan.warnings.push(...warnings);
        return {
            success: true,
            plan,
            diagnostics,
            warnings,
            errors: [],
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenDefaultPlanner = CodeGenDefaultPlanner;
//# sourceMappingURL=codegen-default-planner.js.map