import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class AutonomousCapabilityDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  objective!: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dependencies?: string[];

  @IsOptional()
  @IsBoolean()
  exposeApi?: boolean;

  @IsOptional()
  @IsBoolean()
  persistence?: boolean;

  @IsOptional()
  @IsBoolean()
  humanApprovalRequired?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class AutonomousApplicationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  framework!: string;

  @IsString()
  @IsNotEmpty()
  objective!: string;

  @IsArray()
  @IsString({ each: true })
  capabilities!: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class ExecuteAutonomousFactoryDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  objective!: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AutonomousCapabilityDto)
  capabilities!: AutonomousCapabilityDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AutonomousApplicationDto)
  applications?: AutonomousApplicationDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  qualityThreshold?: number;

  @IsOptional()
  @IsBoolean()
  humanFinalAuthority?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
