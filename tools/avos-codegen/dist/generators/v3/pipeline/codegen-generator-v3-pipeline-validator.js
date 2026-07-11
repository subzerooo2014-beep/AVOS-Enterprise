"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3PipelineValidator = void 0;
class CodeGenGeneratorV3PipelineValidator {
    validate(request) {
        const errors = [];
        if (request.includePrismaAdapter &&
            !request.includePrisma) {
            errors.push("Prisma adapter generation requires Prisma model generation");
        }
        if (request.includePrismaAdapter &&
            !request.includeRepository) {
            errors.push("Prisma adapter generation requires repository generation");
        }
        if (request.includeIntegrationTests &&
            !request.includeRepository) {
            errors.push("Integration test generation requires repository generation");
        }
        if (request.includeOpenApi &&
            !request.includeController) {
            errors.push("OpenAPI generation requires controller generation");
        }
        return errors;
    }
}
exports.CodeGenGeneratorV3PipelineValidator = CodeGenGeneratorV3PipelineValidator;
//# sourceMappingURL=codegen-generator-v3-pipeline-validator.js.map