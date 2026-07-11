import {
  CodeGenArtifactDescriptor,
  CodeGenArtifactType,
} from "../../../artifacts/codegen-artifact.contracts";
import {
  CodeGenGeneratorV3RendererContext,
} from "../contracts/codegen-generator-v3.contracts";
import {
  CodeGenGeneratorV3FieldRenderer,
} from "../renderers/codegen-generator-v3-field-renderer";
import {
  CodeGenGeneratorV3ArtifactFactory,
} from "../runtime/codegen-generator-v3-artifact-factory";

export class CodeGenGeneratorV3DtoRenderer {
  constructor(
    readonly fields =
      new CodeGenGeneratorV3FieldRenderer(),
    readonly artifacts =
      new CodeGenGeneratorV3ArtifactFactory(),
  ) {}

  render(
    context:
      CodeGenGeneratorV3RendererContext,
  ): CodeGenArtifactDescriptor[] {
    if (
      !context.request.includeDtos
    ) {
      return [];
    }

    const {
      request,
      names,
    } = context;

    const basePath =
      `src/${names.kebabModule}/dto`;

    const properties =
      request.fields
        .map(
          (field) =>
            this.fields.renderDtoField(
              field,
            ),
        )
        .join("\n\n");

    const createContent = `import {
  IsBoolean,
  IsISO8601,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class Create${names.pascalEntity}Dto {
${properties}
}
`;

    const updateContent = `import { PartialType } from "@nestjs/mapped-types";
import { Create${names.pascalEntity}Dto } from "./create-${names.kebabEntity}.dto";

export class Update${names.pascalEntity}Dto
  extends PartialType(
    Create${names.pascalEntity}Dto,
  ) {}
`;

    return [
      this.artifacts.create({
        id:
          `${names.kebabModule}:create-dto`,
        key:
          `${names.kebabModule}.dto.create`,
        type:
          CodeGenArtifactType.SOURCE,
        relativePath:
          `${basePath}/create-${names.kebabEntity}.dto.ts`,
        content:
          createContent,
        tags: [
          "dto",
          "validation",
          "generator-v3",
        ],
      }),
      this.artifacts.create({
        id:
          `${names.kebabModule}:update-dto`,
        key:
          `${names.kebabModule}.dto.update`,
        type:
          CodeGenArtifactType.SOURCE,
        relativePath:
          `${basePath}/update-${names.kebabEntity}.dto.ts`,
        content:
          updateContent,
        dependencies: [
          `${names.kebabModule}.dto.create`,
        ],
        tags: [
          "dto",
          "mapped-types",
          "generator-v3",
        ],
      }),
    ];
  }
}
