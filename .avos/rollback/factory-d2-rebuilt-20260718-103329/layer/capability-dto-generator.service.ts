import { Injectable } from "@nestjs/common";

export interface DtoGenerationResult {
  createFileName: string;
  updateFileName: string;
  createClassName: string;
  updateClassName: string;
  createContent: string;
  updateContent: string;
}

@Injectable()
export class CapabilityDtoGeneratorService {
  generate(className: string, slug: string): DtoGenerationResult {
    const createClassName = `Create${className}Dto`;
    const updateClassName = `Update${className}Dto`;

    const createContent = [
      'import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";',
      "",
      `export class ${createClassName} {`,
      "  @IsString()",
      "  @IsNotEmpty()",
      "  name!: string;",
      "",
      "  @IsOptional()",
      "  @IsObject()",
      "  payload?: Record<string, unknown>;",
      "}"
    ].join("\n");

    const updateContent = [
      'import { IsObject, IsOptional, IsString } from "class-validator";',
      "",
      `export class ${updateClassName} {`,
      "  @IsOptional()",
      "  @IsString()",
      "  name?: string;",
      "",
      "  @IsOptional()",
      "  @IsObject()",
      "  payload?: Record<string, unknown>;",
      "}"
    ].join("\n");

    return {
      createFileName: `create-${slug}.dto.ts`,
      updateFileName: `update-${slug}.dto.ts`,
      createClassName,
      updateClassName,
      createContent,
      updateContent
    };
  }
}
