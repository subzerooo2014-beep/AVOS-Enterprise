"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3DtoRenderer = void 0;
const codegen_artifact_contracts_1 = require("../../../artifacts/codegen-artifact.contracts");
const codegen_generator_v3_field_renderer_1 = require("../renderers/codegen-generator-v3-field-renderer");
const codegen_generator_v3_artifact_factory_1 = require("../runtime/codegen-generator-v3-artifact-factory");
class CodeGenGeneratorV3DtoRenderer {
    fields;
    artifacts;
    constructor(fields = new codegen_generator_v3_field_renderer_1.CodeGenGeneratorV3FieldRenderer(), artifacts = new codegen_generator_v3_artifact_factory_1.CodeGenGeneratorV3ArtifactFactory()) {
        this.fields = fields;
        this.artifacts = artifacts;
    }
    render(context) {
        if (!context.request.includeDtos) {
            return [];
        }
        const { request, names, } = context;
        const basePath = `src/${names.kebabModule}/dto`;
        const properties = request.fields
            .map((field) => this.fields.renderDtoField(field))
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
                id: `${names.kebabModule}:create-dto`,
                key: `${names.kebabModule}.dto.create`,
                type: codegen_artifact_contracts_1.CodeGenArtifactType.SOURCE,
                relativePath: `${basePath}/create-${names.kebabEntity}.dto.ts`,
                content: createContent,
                tags: [
                    "dto",
                    "validation",
                    "generator-v3",
                ],
            }),
            this.artifacts.create({
                id: `${names.kebabModule}:update-dto`,
                key: `${names.kebabModule}.dto.update`,
                type: codegen_artifact_contracts_1.CodeGenArtifactType.SOURCE,
                relativePath: `${basePath}/update-${names.kebabEntity}.dto.ts`,
                content: updateContent,
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
exports.CodeGenGeneratorV3DtoRenderer = CodeGenGeneratorV3DtoRenderer;
//# sourceMappingURL=codegen-generator-v3-dto-renderer.js.map