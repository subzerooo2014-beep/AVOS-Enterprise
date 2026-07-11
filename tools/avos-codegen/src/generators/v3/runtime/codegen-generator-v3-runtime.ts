import {
  CodeGenGeneratorV3Request,
  CodeGenGeneratorV3Result,
} from "../contracts/codegen-generator-v3.contracts";
import {
  CodeGenGeneratorV3NamingEngine,
} from "../naming/codegen-generator-v3-naming-engine";
import {
  CodeGenGeneratorV3ModuleRenderer,
} from "../module/codegen-generator-v3-module-renderer";
import {
  CodeGenGeneratorV3DtoRenderer,
} from "../module/codegen-generator-v3-dto-renderer";
import {
  CodeGenGeneratorV3PrismaRenderer,
} from "../prisma/codegen-generator-v3-prisma-renderer";
import {
  CodeGenGeneratorV3TestRenderer,
} from "../tests/codegen-generator-v3-test-renderer";
import {
  CodeGenGeneratorV3ManifestRenderer,
} from "../module/codegen-generator-v3-manifest-renderer";

export class CodeGenGeneratorV3Runtime {
  constructor(
    readonly naming =
      new CodeGenGeneratorV3NamingEngine(),
    readonly modules =
      new CodeGenGeneratorV3ModuleRenderer(),
    readonly dtos =
      new CodeGenGeneratorV3DtoRenderer(),
    readonly prisma =
      new CodeGenGeneratorV3PrismaRenderer(),
    readonly tests =
      new CodeGenGeneratorV3TestRenderer(),
    readonly manifests =
      new CodeGenGeneratorV3ManifestRenderer(),
  ) {}

  execute(
    request:
      CodeGenGeneratorV3Request,
  ): CodeGenGeneratorV3Result {
    const errors =
      this.validateRequest(
        request,
      );

    const names =
      this.naming.create(
        request,
      );

    if (
      errors.length > 0
    ) {
      return {
        success: false,
        request:
          structuredClone(
            request,
          ),
        names,
        artifacts: [],
        warnings: [],
        errors,
        generatedAt:
          new Date().toISOString(),
      };
    }

    const context = {
      request,
      names,
    };

    const artifacts = [
      ...this.modules.render(
        context,
      ),
      ...this.dtos.render(
        context,
      ),
      ...this.prisma.render(
        context,
      ),
      ...this.tests.render(
        context,
      ),
      ...this.manifests.render(
        context,
      ),
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

    const warnings: string[] = [];

    if (
      request.fields.length ===
      0
    ) {
      warnings.push(
        "Generator request has no domain fields",
      );
    }

    if (
      duplicateKeys.length >
      0
    ) {
      errors.push(
        `Duplicate artifact keys: ${Array.from(new Set(duplicateKeys)).join(", ")}`,
      );
    }

    return {
      success:
        errors.length === 0,
      request:
        structuredClone(
          request,
        ),
      names,
      artifacts,
      warnings,
      errors,
      generatedAt:
        new Date().toISOString(),
    };
  }

  private validateRequest(
    request:
      CodeGenGeneratorV3Request,
  ): string[] {
    const errors: string[] = [];

    if (
      !request.moduleName.trim()
    ) {
      errors.push(
        "moduleName is required",
      );
    }

    const fieldNames =
      request.fields.map(
        (field) =>
          field.name,
      );

    const duplicateFieldNames =
      fieldNames.filter(
        (name, index) =>
          fieldNames.indexOf(name) !==
          index,
      );

    if (
      duplicateFieldNames.length >
      0
    ) {
      errors.push(
        `Duplicate field names: ${Array.from(new Set(duplicateFieldNames)).join(", ")}`,
      );
    }

    for (
      const field of
      request.fields
    ) {
      if (
        !/^[A-Za-z_][A-Za-z0-9_]*$/.test(
          field.name,
        )
      ) {
        errors.push(
          `Invalid field name: ${field.name}`,
        );
      }
    }

    if (
      request.includeController &&
      !request.includeService
    ) {
      errors.push(
        "Controller generation requires service generation",
      );
    }

    return errors;
  }
}
