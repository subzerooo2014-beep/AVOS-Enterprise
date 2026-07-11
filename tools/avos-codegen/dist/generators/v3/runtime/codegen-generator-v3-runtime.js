"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3Runtime = void 0;
const codegen_generator_v3_naming_engine_1 = require("../naming/codegen-generator-v3-naming-engine");
const codegen_generator_v3_module_renderer_1 = require("../module/codegen-generator-v3-module-renderer");
const codegen_generator_v3_dto_renderer_1 = require("../module/codegen-generator-v3-dto-renderer");
const codegen_generator_v3_prisma_renderer_1 = require("../prisma/codegen-generator-v3-prisma-renderer");
const codegen_generator_v3_test_renderer_1 = require("../tests/codegen-generator-v3-test-renderer");
const codegen_generator_v3_manifest_renderer_1 = require("../module/codegen-generator-v3-manifest-renderer");
class CodeGenGeneratorV3Runtime {
    naming;
    modules;
    dtos;
    prisma;
    tests;
    manifests;
    constructor(naming = new codegen_generator_v3_naming_engine_1.CodeGenGeneratorV3NamingEngine(), modules = new codegen_generator_v3_module_renderer_1.CodeGenGeneratorV3ModuleRenderer(), dtos = new codegen_generator_v3_dto_renderer_1.CodeGenGeneratorV3DtoRenderer(), prisma = new codegen_generator_v3_prisma_renderer_1.CodeGenGeneratorV3PrismaRenderer(), tests = new codegen_generator_v3_test_renderer_1.CodeGenGeneratorV3TestRenderer(), manifests = new codegen_generator_v3_manifest_renderer_1.CodeGenGeneratorV3ManifestRenderer()) {
        this.naming = naming;
        this.modules = modules;
        this.dtos = dtos;
        this.prisma = prisma;
        this.tests = tests;
        this.manifests = manifests;
    }
    execute(request) {
        const errors = this.validateRequest(request);
        const names = this.naming.create(request);
        if (errors.length > 0) {
            return {
                success: false,
                request: structuredClone(request),
                names,
                artifacts: [],
                warnings: [],
                errors,
                generatedAt: new Date().toISOString(),
            };
        }
        const context = {
            request,
            names,
        };
        const artifacts = [
            ...this.modules.render(context),
            ...this.dtos.render(context),
            ...this.prisma.render(context),
            ...this.tests.render(context),
            ...this.manifests.render(context),
        ];
        const duplicateKeys = artifacts
            .map((artifact) => artifact.key)
            .filter((key, index, values) => values.indexOf(key) !==
            index);
        const warnings = [];
        if (request.fields.length ===
            0) {
            warnings.push("Generator request has no domain fields");
        }
        if (duplicateKeys.length >
            0) {
            errors.push(`Duplicate artifact keys: ${Array.from(new Set(duplicateKeys)).join(", ")}`);
        }
        return {
            success: errors.length === 0,
            request: structuredClone(request),
            names,
            artifacts,
            warnings,
            errors,
            generatedAt: new Date().toISOString(),
        };
    }
    validateRequest(request) {
        const errors = [];
        if (!request.moduleName.trim()) {
            errors.push("moduleName is required");
        }
        const fieldNames = request.fields.map((field) => field.name);
        const duplicateFieldNames = fieldNames.filter((name, index) => fieldNames.indexOf(name) !==
            index);
        if (duplicateFieldNames.length >
            0) {
            errors.push(`Duplicate field names: ${Array.from(new Set(duplicateFieldNames)).join(", ")}`);
        }
        for (const field of request.fields) {
            if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(field.name)) {
                errors.push(`Invalid field name: ${field.name}`);
            }
        }
        if (request.includeController &&
            !request.includeService) {
            errors.push("Controller generation requires service generation");
        }
        return errors;
    }
}
exports.CodeGenGeneratorV3Runtime = CodeGenGeneratorV3Runtime;
//# sourceMappingURL=codegen-generator-v3-runtime.js.map