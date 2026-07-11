import {
  CodeGenGeneratorV3ExtendedRequest,
  CodeGenGeneratorV3PipelineResult,
} from "../contracts/codegen-generator-v3-extended.contracts";
import {
  CodeGenGeneratorV3Runtime,
} from "../runtime/codegen-generator-v3-runtime";
import {
  CodeGenGeneratorV3NamingEngine,
} from "../naming/codegen-generator-v3-naming-engine";
import {
  CodeGenGeneratorV3PaginationRenderer,
} from "../pagination/codegen-generator-v3-pagination-renderer";
import {
  CodeGenGeneratorV3RepositoryRenderer,
} from "../repository/codegen-generator-v3-repository-renderer";
import {
  CodeGenGeneratorV3PrismaAdapterRenderer,
} from "../repository/codegen-generator-v3-prisma-adapter-renderer";
import {
  CodeGenGeneratorV3OpenApiRenderer,
} from "../openapi/codegen-generator-v3-openapi-renderer";
import {
  CodeGenGeneratorV3IntegrationTestRenderer,
} from "../integration/codegen-generator-v3-integration-test-renderer";
import {
  CodeGenGeneratorV3PipelineValidator,
} from "./codegen-generator-v3-pipeline-validator";
import {
  CodeGenGeneratorV3QualityGate,
} from "../quality/codegen-generator-v3-quality-gate";

export class CodeGenGeneratorV3Pipeline {
  constructor(
    readonly core =
      new CodeGenGeneratorV3Runtime(),
    readonly naming =
      new CodeGenGeneratorV3NamingEngine(),
    readonly pagination =
      new CodeGenGeneratorV3PaginationRenderer(),
    readonly repositories =
      new CodeGenGeneratorV3RepositoryRenderer(),
    readonly prismaAdapters =
      new CodeGenGeneratorV3PrismaAdapterRenderer(),
    readonly openApi =
      new CodeGenGeneratorV3OpenApiRenderer(),
    readonly integrationTests =
      new CodeGenGeneratorV3IntegrationTestRenderer(),
    readonly validator =
      new CodeGenGeneratorV3PipelineValidator(),
    readonly qualityGate =
      new CodeGenGeneratorV3QualityGate(),
  ) {}

  async execute(
    request:
      CodeGenGeneratorV3ExtendedRequest,
  ): Promise<
    CodeGenGeneratorV3PipelineResult
  > {
    const errors =
      this.validator.validate(
        request,
      );

    const coreResult =
      this.core.execute(
        request,
      );

    errors.push(
      ...coreResult.errors,
    );

    const names =
      this.naming.create(
        request,
      );

    const context = {
      request,
      names,
    };

    const artifacts = [
      ...coreResult.artifacts,
      ...(request.includePagination
        ? this.pagination.render(
            context,
          )
        : []),
      ...(request.includeRepository
        ? this.repositories.render(
            context,
          )
        : []),
      ...(request.includePrismaAdapter
        ? this.prismaAdapters.render(
            context,
          )
        : []),
      ...(request.includeOpenApi
        ? this.openApi.render(
            context,
          )
        : []),
      ...(request.includeIntegrationTests
        ? this.integrationTests.render(
            context,
          )
        : []),
    ];

    const duplicateKeys =
      artifacts
        .map(
          (artifact) =>
            artifact.key,
        )
        .filter(
          (key, index, values) =>
            values.indexOf(key) !==
            index,
        );

    if (
      duplicateKeys.length >
      0
    ) {
      errors.push(
        `Duplicate pipeline artifact keys: ${Array.from(new Set(duplicateKeys)).join(", ")}`,
      );
    }

    if (
      errors.length > 0
    ) {
      return {
        success: false,
        generation:
          coreResult,
        artifacts,
        warnings:
          [...coreResult.warnings],
        errors,
        generatedAt:
          new Date().toISOString(),
      };
    }

    const gate =
      await this.qualityGate.execute({
        workspaceRoot:
          request.workspaceRoot,
        targetRoot:
          request.targetRoot,
        variables: {
          moduleName:
            request.moduleName,
        },
        artifacts,
      });

    return {
      success:
        gate.success,
      generation:
        coreResult,
      artifacts,
      quality:
        gate.quality,
      validation:
        gate.validation,
      warnings: [
        ...coreResult.warnings,
        ...gate.validation.issues
          .filter(
            (issue) =>
              issue.severity ===
              "warning",
          )
          .map(
            (issue) =>
              issue.message,
          ),
      ],
      errors: [
        ...errors,
        ...gate.validation.issues
          .filter(
            (issue) =>
              issue.severity ===
                "error" ||
              issue.severity ===
                "critical",
          )
          .map(
            (issue) =>
              issue.message,
          ),
      ],
      generatedAt:
        new Date().toISOString(),
    };
  }
}
