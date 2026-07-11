"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3Pipeline = void 0;
const codegen_generator_v3_runtime_1 = require("../runtime/codegen-generator-v3-runtime");
const codegen_generator_v3_naming_engine_1 = require("../naming/codegen-generator-v3-naming-engine");
const codegen_generator_v3_pagination_renderer_1 = require("../pagination/codegen-generator-v3-pagination-renderer");
const codegen_generator_v3_repository_renderer_1 = require("../repository/codegen-generator-v3-repository-renderer");
const codegen_generator_v3_prisma_adapter_renderer_1 = require("../repository/codegen-generator-v3-prisma-adapter-renderer");
const codegen_generator_v3_openapi_renderer_1 = require("../openapi/codegen-generator-v3-openapi-renderer");
const codegen_generator_v3_integration_test_renderer_1 = require("../integration/codegen-generator-v3-integration-test-renderer");
const codegen_generator_v3_pipeline_validator_1 = require("./codegen-generator-v3-pipeline-validator");
const codegen_generator_v3_quality_gate_1 = require("../quality/codegen-generator-v3-quality-gate");
class CodeGenGeneratorV3Pipeline {
    core;
    naming;
    pagination;
    repositories;
    prismaAdapters;
    openApi;
    integrationTests;
    validator;
    qualityGate;
    constructor(core = new codegen_generator_v3_runtime_1.CodeGenGeneratorV3Runtime(), naming = new codegen_generator_v3_naming_engine_1.CodeGenGeneratorV3NamingEngine(), pagination = new codegen_generator_v3_pagination_renderer_1.CodeGenGeneratorV3PaginationRenderer(), repositories = new codegen_generator_v3_repository_renderer_1.CodeGenGeneratorV3RepositoryRenderer(), prismaAdapters = new codegen_generator_v3_prisma_adapter_renderer_1.CodeGenGeneratorV3PrismaAdapterRenderer(), openApi = new codegen_generator_v3_openapi_renderer_1.CodeGenGeneratorV3OpenApiRenderer(), integrationTests = new codegen_generator_v3_integration_test_renderer_1.CodeGenGeneratorV3IntegrationTestRenderer(), validator = new codegen_generator_v3_pipeline_validator_1.CodeGenGeneratorV3PipelineValidator(), qualityGate = new codegen_generator_v3_quality_gate_1.CodeGenGeneratorV3QualityGate()) {
        this.core = core;
        this.naming = naming;
        this.pagination = pagination;
        this.repositories = repositories;
        this.prismaAdapters = prismaAdapters;
        this.openApi = openApi;
        this.integrationTests = integrationTests;
        this.validator = validator;
        this.qualityGate = qualityGate;
    }
    async execute(request) {
        const errors = this.validator.validate(request);
        const coreResult = this.core.execute(request);
        errors.push(...coreResult.errors);
        const names = this.naming.create(request);
        const context = {
            request,
            names,
        };
        const artifacts = [
            ...coreResult.artifacts,
            ...(request.includePagination
                ? this.pagination.render(context)
                : []),
            ...(request.includeRepository
                ? this.repositories.render(context)
                : []),
            ...(request.includePrismaAdapter
                ? this.prismaAdapters.render(context)
                : []),
            ...(request.includeOpenApi
                ? this.openApi.render(context)
                : []),
            ...(request.includeIntegrationTests
                ? this.integrationTests.render(context)
                : []),
        ];
        const duplicateKeys = artifacts
            .map((artifact) => artifact.key)
            .filter((key, index, values) => values.indexOf(key) !==
            index);
        if (duplicateKeys.length >
            0) {
            errors.push(`Duplicate pipeline artifact keys: ${Array.from(new Set(duplicateKeys)).join(", ")}`);
        }
        if (errors.length > 0) {
            return {
                success: false,
                generation: coreResult,
                artifacts,
                warnings: [...coreResult.warnings],
                errors,
                generatedAt: new Date().toISOString(),
            };
        }
        const gate = await this.qualityGate.execute({
            workspaceRoot: request.workspaceRoot,
            targetRoot: request.targetRoot,
            variables: {
                moduleName: request.moduleName,
            },
            artifacts,
        });
        return {
            success: gate.success,
            generation: coreResult,
            artifacts,
            quality: gate.quality,
            validation: gate.validation,
            warnings: [
                ...coreResult.warnings,
                ...gate.validation.issues
                    .filter((issue) => issue.severity ===
                    "warning")
                    .map((issue) => issue.message),
            ],
            errors: [
                ...errors,
                ...gate.validation.issues
                    .filter((issue) => issue.severity ===
                    "error" ||
                    issue.severity ===
                        "critical")
                    .map((issue) => issue.message),
            ],
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenGeneratorV3Pipeline = CodeGenGeneratorV3Pipeline;
//# sourceMappingURL=codegen-generator-v3-pipeline.js.map