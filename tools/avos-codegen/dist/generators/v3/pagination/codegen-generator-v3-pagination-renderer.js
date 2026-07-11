"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3PaginationRenderer = void 0;
const codegen_artifact_contracts_1 = require("../../../artifacts/codegen-artifact.contracts");
const codegen_generator_v3_artifact_factory_1 = require("../runtime/codegen-generator-v3-artifact-factory");
class CodeGenGeneratorV3PaginationRenderer {
    artifacts;
    constructor(artifacts = new codegen_generator_v3_artifact_factory_1.CodeGenGeneratorV3ArtifactFactory()) {
        this.artifacts = artifacts;
    }
    render(context) {
        const basePath = `src/${context.names.kebabModule}/dto`;
        const content = `import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class ${context.names.pascalEntity}QueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortDirection?: "asc" | "desc";
}
`;
        return [
            this.artifacts.create({
                id: `${context.names.kebabModule}:query-dto`,
                key: `${context.names.kebabModule}.dto.query`,
                type: codegen_artifact_contracts_1.CodeGenArtifactType.SOURCE,
                relativePath: `${basePath}/${context.names.kebabEntity}-query.dto.ts`,
                content,
                tags: [
                    "dto",
                    "pagination",
                    "filtering",
                    "generator-v3",
                ],
            }),
        ];
    }
}
exports.CodeGenGeneratorV3PaginationRenderer = CodeGenGeneratorV3PaginationRenderer;
//# sourceMappingURL=codegen-generator-v3-pagination-renderer.js.map