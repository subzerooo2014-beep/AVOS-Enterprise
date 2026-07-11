import {
  CodeGenArtifactDescriptor,
  CodeGenArtifactType,
} from "../../../artifacts/codegen-artifact.contracts";
import {
  CodeGenGeneratorV3RendererContext,
} from "../contracts/codegen-generator-v3.contracts";
import {
  CodeGenGeneratorV3ArtifactFactory,
} from "../runtime/codegen-generator-v3-artifact-factory";

export class CodeGenGeneratorV3OpenApiRenderer {
  constructor(
    readonly artifacts =
      new CodeGenGeneratorV3ArtifactFactory(),
  ) {}

  render(
    context:
      CodeGenGeneratorV3RendererContext,
  ): CodeGenArtifactDescriptor[] {
    const {
      names,
    } = context;

    const basePath =
      `src/${names.kebabModule}`;

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
        id:
          `${names.kebabModule}:openapi`,
        key:
          `${names.kebabModule}.openapi`,
        type:
          CodeGenArtifactType.SOURCE,
        relativePath:
          `${basePath}/${names.kebabModule}.openapi.ts`,
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
