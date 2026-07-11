"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3PrismaRenderer = void 0;
const codegen_artifact_contracts_1 = require("../../../artifacts/codegen-artifact.contracts");
const codegen_generator_v3_field_renderer_1 = require("../renderers/codegen-generator-v3-field-renderer");
const codegen_generator_v3_artifact_factory_1 = require("../runtime/codegen-generator-v3-artifact-factory");
class CodeGenGeneratorV3PrismaRenderer {
    fields;
    artifacts;
    constructor(fields = new codegen_generator_v3_field_renderer_1.CodeGenGeneratorV3FieldRenderer(), artifacts = new codegen_generator_v3_artifact_factory_1.CodeGenGeneratorV3ArtifactFactory()) {
        this.fields = fields;
        this.artifacts = artifacts;
    }
    render(context) {
        if (!context.request.includePrisma) {
            return [];
        }
        const { request, names, } = context;
        const modelFields = request.fields
            .map((field) => this.fields.renderPrismaField(field))
            .join("\n");
        const indexedFields = request.fields
            .filter((field) => field.indexed)
            .map((field) => `  @@index([${field.name}])`)
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
                id: `${names.kebabModule}:prisma-model`,
                key: `${names.kebabModule}.prisma`,
                type: codegen_artifact_contracts_1.CodeGenArtifactType.SCHEMA,
                relativePath: `prisma/generated/${names.kebabEntity}.prisma`,
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
exports.CodeGenGeneratorV3PrismaRenderer = CodeGenGeneratorV3PrismaRenderer;
//# sourceMappingURL=codegen-generator-v3-prisma-renderer.js.map