import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import {
  DocumentationAssetInput,
  DocumentationAssetType,
} from "./documentation-ai.types";

export class DocumentationAssetInputDto implements DocumentationAssetInput {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  type?: DocumentationAssetType;

  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dependencies?: string[];

  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class GenerateDocumentationDto {
  @IsString()
  objective!: string;

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentationAssetInputDto)
  assets: DocumentationAssetInputDto[] = [];

  @IsOptional()
  @IsBoolean()
  requireHumanApproval = true;
}

export class ApproveDocumentationDto {
  @IsString()
  approvedBy!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}