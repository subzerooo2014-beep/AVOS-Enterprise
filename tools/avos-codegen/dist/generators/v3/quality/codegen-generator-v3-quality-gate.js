"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3QualityGate = void 0;
const codegen_quality_runtime_1 = require("../../../quality/runtime/codegen-quality-runtime");
const codegen_validation_runtime_1 = require("../../../validation/runtime/codegen-validation-runtime");
class CodeGenGeneratorV3QualityGate {
    quality;
    validation;
    constructor(quality = new codegen_quality_runtime_1.CodeGenQualityRuntime(), validation = new codegen_validation_runtime_1.CodeGenValidationRuntime()) {
        this.quality = quality;
        this.validation = validation;
    }
    async execute(input) {
        const quality = await this.quality.execute(input.artifacts, {
            owner: "AVOS",
            classification: "generator-v3-quality-gate",
        });
        const validation = await this.validation.execute({
            workspaceRoot: input.workspaceRoot,
            targetRoot: input.targetRoot,
            ...(input.blueprintKey
                ? {
                    blueprintKey: input.blueprintKey,
                }
                : {}),
            templateKeys: [...(input.templateKeys ?? [])],
            variables: input.variables,
            artifacts: [...input.artifacts],
            featureFlags: {},
            metadata: {
                owner: "AVOS",
                classification: "generator-v3-validation-gate",
            },
        });
        return {
            success: quality.success &&
                validation.report.success,
            quality,
            validation: validation.report,
            health: validation.health,
        };
    }
}
exports.CodeGenGeneratorV3QualityGate = CodeGenGeneratorV3QualityGate;
//# sourceMappingURL=codegen-generator-v3-quality-gate.js.map