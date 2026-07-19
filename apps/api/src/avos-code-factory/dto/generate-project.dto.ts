import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { FactoryArtifactType } from "../contracts/workspace.contracts";
import { IsIn } from "class-validator";

export class GenerateProjectFileDto {
  @IsString()
  @IsNotEmpty()
  path!: string;

  @IsIn([
    "source",
    "configuration",
    "schema",
    "documentation",
    "test",
    "build",
    "package",
    "metadata",
  ])
  type!: FactoryArtifactType;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsObject()
  variables?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class GenerateProjectDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  objective!: string;

  @IsString()
  @IsNotEmpty()
  language!: string;

  @IsOptional()
  @IsString()
  framework?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GenerateProjectFileDto)
  files!: GenerateProjectFileDto[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
