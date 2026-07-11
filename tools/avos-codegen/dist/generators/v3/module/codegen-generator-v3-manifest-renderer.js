"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3ManifestRenderer = void 0;
const codegen_artifact_contracts_1 = require("../../../artifacts/codegen-artifact.contracts");
const codegen_generator_v3_artifact_factory_1 = require("../runtime/codegen-generator-v3-artifact-factory");
class CodeGenGeneratorV3ManifestRenderer {
    artifacts;
    constructor(artifacts = new codegen_generator_v3_artifact_factory_1.CodeGenGeneratorV3ArtifactFactory()) {
        this.artifacts = artifacts;
    }
    render(context) {
        const { request, names, } = context;
        const basePath = `src/${names.kebabModule}`;
        const results = [];
        if (request.includeManifest) {
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
            results.push(this.artifacts.create({
                id: `${names.kebabModule}:manifest`,
                key: `${names.kebabModule}.manifest`,
                type: codegen_artifact_contracts_1.CodeGenArtifactType.MANIFEST,
                relativePath: `${basePath}/${names.kebabModule}.manifest.ts`,
                content,
                tags: [
                    "manifest",
                    "generator-v3",
                ],
            }));
        }
        if (request.includeIndex) {
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
            results.push(this.artifacts.create({
                id: `${names.kebabModule}:index`,
                key: `${names.kebabModule}.index`,
                type: codegen_artifact_contracts_1.CodeGenArtifactType.SOURCE,
                relativePath: `${basePath}/index.ts`,
                content: `${exports.join("\n")}\n`,
                tags: [
                    "barrel",
                    "generator-v3",
                ],
            }));
        }
        return results;
    }
}
exports.CodeGenGeneratorV3ManifestRenderer = CodeGenGeneratorV3ManifestRenderer;
//# sourceMappingURL=codegen-generator-v3-manifest-renderer.js.map