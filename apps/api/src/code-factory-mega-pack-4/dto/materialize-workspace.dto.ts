import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

export class WorkspaceFileDto {
  @IsString()
  relativePath!: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsBoolean()
  executable?: boolean;
}

export class MaterializeWorkspaceDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => WorkspaceFileDto)
  files!: WorkspaceFileDto[];

  @IsOptional()
  @IsBoolean()
  createCheckpoint?: boolean;
}