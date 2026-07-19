import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateExecutionStageDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  handler!: string;
}

export class CreateExecutionDto {
  @IsString()
  @IsNotEmpty()
  objective!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExecutionStageDto)
  stages!: CreateExecutionStageDto[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
