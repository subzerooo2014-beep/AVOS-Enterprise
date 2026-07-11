"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3OpenApiRenderer = void 0;
const codegen_artifact_contracts_1 = require("../../../artifacts/codegen-artifact.contracts");
const codegen_generator_v3_artifact_factory_1 = require("../runtime/codegen-generator-v3-artifact-factory");
class CodeGenGeneratorV3OpenApiRenderer {
    artifacts;
    constructor(artifacts = new codegen_generator_v3_artifact_factory_1.CodeGenGeneratorV3ArtifactFactory()) {
        this.artifacts = artifacts;
    }
    render(context) {
        const { names, } = context;
        const basePath = `src/${names.kebabModule}`;
        const content = `import {
  applyDecorators,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

export function ${names.pascalModule}ApiTags() {
  return applyDecorators(
    ApiTags("${names.routeName}"),
  );
}

export function ${names.pascalModule}ApiList() {
  return applyDecorators(
    ApiOperation({
      summary:
        "List ${names.pascalEntity} records",
    }),
    ApiOkResponse(),
  );
}

export function ${names.pascalModule}ApiGet() {
  return applyDecorators(
    ApiOperation({
      summary:
        "Get ${names.pascalEntity} record",
    }),
    ApiOkResponse(),
    ApiNotFoundResponse(),
  );
}

export function ${names.pascalModule}ApiCreate() {
  return applyDecorators(
    ApiOperation({
      summary:
        "Create ${names.pascalEntity} record",
    }),
    ApiCreatedResponse(),
    ApiBadRequestResponse(),
  );
}

export function ${names.pascalModule}ApiUpdate() {
  return applyDecorators(
    ApiOperation({
      summary:
        "Update ${names.pascalEntity} record",
    }),
    ApiOkResponse(),
    ApiNotFoundResponse(),
  );
}

export function ${names.pascalModule}ApiRemove() {
  return applyDecorators(
    ApiOperation({
      summary:
        "Remove ${names.pascalEntity} record",
    }),
    ApiOkResponse(),
    ApiNotFoundResponse(),
  );
}
`;
        return [
            this.artifacts.create({
                id: `${names.kebabModule}:openapi`,
                key: `${names.kebabModule}.openapi`,
                type: codegen_artifact_contracts_1.CodeGenArtifactType.SOURCE,
                relativePath: `${basePath}/${names.kebabModule}.openapi.ts`,
                content,
                tags: [
                    "openapi",
                    "swagger",
                    "generator-v3",
                ],
            }),
        ];
    }
}
exports.CodeGenGeneratorV3OpenApiRenderer = CodeGenGeneratorV3OpenApiRenderer;
//# sourceMappingURL=codegen-generator-v3-openapi-renderer.js.map