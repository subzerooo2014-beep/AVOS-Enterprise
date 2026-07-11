import { CodeGenGeneratorV3ExtendedRequest, CodeGenGeneratorV3PipelineResult } from "../contracts/codegen-generator-v3-extended.contracts";
import { CodeGenGeneratorV3Runtime } from "../runtime/codegen-generator-v3-runtime";
import { CodeGenGeneratorV3NamingEngine } from "../naming/codegen-generator-v3-naming-engine";
import { CodeGenGeneratorV3PaginationRenderer } from "../pagination/codegen-generator-v3-pagination-renderer";
import { CodeGenGeneratorV3RepositoryRenderer } from "../repository/codegen-generator-v3-repository-renderer";
import { CodeGenGeneratorV3PrismaAdapterRenderer } from "../repository/codegen-generator-v3-prisma-adapter-renderer";
import { CodeGenGeneratorV3OpenApiRenderer } from "../openapi/codegen-generator-v3-openapi-renderer";
import { CodeGenGeneratorV3IntegrationTestRenderer } from "../integration/codegen-generator-v3-integration-test-renderer";
import { CodeGenGeneratorV3PipelineValidator } from "./codegen-generator-v3-pipeline-validator";
import { CodeGenGeneratorV3QualityGate } from "../quality/codegen-generator-v3-quality-gate";
export declare class CodeGenGeneratorV3Pipeline {
    readonly core: CodeGenGeneratorV3Runtime;
    readonly naming: CodeGenGeneratorV3NamingEngine;
    readonly pagination: CodeGenGeneratorV3PaginationRenderer;
    readonly repositories: CodeGenGeneratorV3RepositoryRenderer;
    readonly prismaAdapters: CodeGenGeneratorV3PrismaAdapterRenderer;
    readonly openApi: CodeGenGeneratorV3OpenApiRenderer;
    readonly integrationTests: CodeGenGeneratorV3IntegrationTestRenderer;
    readonly validator: CodeGenGeneratorV3PipelineValidator;
    readonly qualityGate: CodeGenGeneratorV3QualityGate;
    constructor(core?: CodeGenGeneratorV3Runtime, naming?: CodeGenGeneratorV3NamingEngine, pagination?: CodeGenGeneratorV3PaginationRenderer, repositories?: CodeGenGeneratorV3RepositoryRenderer, prismaAdapters?: CodeGenGeneratorV3PrismaAdapterRenderer, openApi?: CodeGenGeneratorV3OpenApiRenderer, integrationTests?: CodeGenGeneratorV3IntegrationTestRenderer, validator?: CodeGenGeneratorV3PipelineValidator, qualityGate?: CodeGenGeneratorV3QualityGate);
    execute(request: CodeGenGeneratorV3ExtendedRequest): Promise<CodeGenGeneratorV3PipelineResult>;
}
//# sourceMappingURL=codegen-generator-v3-pipeline.d.ts.map