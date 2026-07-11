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

export class CodeGenGeneratorV3ManifestRenderer {
  constructor(
    readonly artifacts =
      new CodeGenGeneratorV3ArtifactFactory(),
  ) {}

  render(
    context:
      CodeGenGeneratorV3RendererContext,
  ): CodeGenArtifactDescriptor[] {
    const {
      request,
      names,
    } = context;

    const basePath =
      `src/${names.kebabModule}`;

    const results:
      CodeGenArtifactDescriptor[] =
      [];

    if (
      request.includeManifest
    ) {
      const content = `export const ${names.constantModule}_MANIFEST = {
  key:
    "${names.kebabModule}",
  name:
    "${names.pascalModule}",
  entity:
    "${names.pascalEntity}",
  route:
    "${names.routeName}",
  version:
    "3.0.0-alpha.1",
  generatedBy:
    "AVOS CodeGen OS Generator V3",
  capabilities: [
    ${[
      request.includeController
        ? '"controller"'
        : undefined,
      request.includeService
        ? '"service"'
        : undefined,
      request.includeDtos
        ? '"dto"'
        : undefined,
      request.includePrisma
        ? '"prisma"'
        : undefined,
      request.includeTests
        ? '"tests"'
        : undefined,
    ]
      .filter(Boolean)
      .join(",\n    ")}
  ],
} as const;
`;

      results.push(
        this.artifacts.create({
          id:
            `${names.kebabModule}:manifest`,
          key:
            `${names.kebabModule}.manifest`,
          type:
            CodeGenArtifactType.MANIFEST,
          relativePath:
            `${basePath}/${names.kebabModule}.manifest.ts`,
          content,
          tags: [
            "manifest",
            "generator-v3",
          ],
        }),
      );
    }

    if (
      request.includeIndex
    ) {
      const exports = [
        `export * from "./${names.kebabModule}.module";`,
        ...(request.includeController
          ? [
              `export * from "./${names.kebabModule}.controller";`,
            ]
          : []),
        ...(request.includeService
          ? [
              `export * from "./${names.kebabModule}.service";`,
            ]
          : []),
        ...(request.includeDtos
          ? [
              `export * from "./dto/create-${names.kebabEntity}.dto";`,
              `export * from "./dto/update-${names.kebabEntity}.dto";`,
            ]
          : []),
        ...(request.includeManifest
          ? [
              `export * from "./${names.kebabModule}.manifest";`,
            ]
          : []),
      ];

      results.push(
        this.artifacts.create({
          id:
            `${names.kebabModule}:index`,
          key:
            `${names.kebabModule}.index`,
          type:
            CodeGenArtifactType.SOURCE,
          relativePath:
            `${basePath}/index.ts`,
          content:
            `${exports.join("\n")}\n`,
          tags: [
            "barrel",
            "generator-v3",
          ],
        }),
      );
    }

    return results;
  }
}
