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

export class CodeGenGeneratorV3PrismaRenderer {
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
      !context.request.includePrisma
    ) {
      return [];
    }

    const {
      request,
      names,
    } = context;

    const modelFields =
      request.fields
        .map(
          (field) =>
            this.fields.renderPrismaField(
              field,
            ),
        )
        .join("\n");

    const indexedFields =
      request.fields
        .filter(
          (field) =>
            field.indexed,
        )
        .map(
          (field) =>
            `  @@index([${field.name}])`,
        )
        .join("\n");

    const content = `model ${names.pascalEntity} {
  id        String   @id @default(cuid())
${modelFields}
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
${indexedFields ? `\n${indexedFields}` : ""}
}
`;

    return [
      this.artifacts.create({
        id:
          `${names.kebabModule}:prisma-model`,
        key:
          `${names.kebabModule}.prisma`,
        type:
          CodeGenArtifactType.SCHEMA,
        relativePath:
          `prisma/generated/${names.kebabEntity}.prisma`,
        content,
        tags: [
          "prisma",
          "schema",
          "generator-v3",
        ],
      }),
    ];
  }
}
