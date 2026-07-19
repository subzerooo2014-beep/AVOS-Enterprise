import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class GenerateCapabilityDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  capabilityName!: string;

  @IsString()
  @IsNotEmpty()
  objective!: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsBoolean()
  includeController?: boolean;

  @IsOptional()
  @IsBoolean()
  includeTests?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
