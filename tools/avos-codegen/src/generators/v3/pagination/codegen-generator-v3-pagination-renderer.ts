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

export class CodeGenGeneratorV3PaginationRenderer {
  constructor(
    readonly artifacts =
      new CodeGenGeneratorV3ArtifactFactory(),
  ) {}

  render(
    context:
      CodeGenGeneratorV3RendererContext,
  ): CodeGenArtifactDescriptor[] {
    const basePath =
      `src/${context.names.kebabModule}/dto`;

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
        id:
          `${context.names.kebabModule}:query-dto`,
        key:
          `${context.names.kebabModule}.dto.query`,
        type:
          CodeGenArtifactType.SOURCE,
        relativePath:
          `${basePath}/${context.names.kebabEntity}-query.dto.ts`,
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
