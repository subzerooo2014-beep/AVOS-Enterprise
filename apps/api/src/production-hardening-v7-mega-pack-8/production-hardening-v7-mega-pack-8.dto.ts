import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsIn,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import {
  ConfigurationEnvironment,
  ConfigurationValue,
  FeatureFlagStrategy,
  PolicySeverity,
} from "./production-hardening-v7-mega-pack-8.types";

export class CreateConfigurationDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  key!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  service!: string;

  @IsIn(["development", "staging", "production"])
  environment!: ConfigurationEnvironment;

  @IsDefined()
  value!: ConfigurationValue;

  @IsOptional()
  @IsBoolean()
  sensitive?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  requestedBy!: string;
}

export class ApproveConfigurationDto {
  @IsIn(["approved", "rejected"])
  decision!: "approved" | "rejected";

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  approver!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  reason!: string;
}

export class CreateBaselineDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  service!: string;

  @IsIn(["development", "staging", "production"])
  environment!: ConfigurationEnvironment;

  @IsObject()
  configuration!: Record<string, ConfigurationValue>;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  createdBy!: string;
}

export class CreatePolicyDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  code!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  service?: string;

  @IsOptional()
  @IsIn(["development", "staging", "production"])
  environment?: ConfigurationEnvironment;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  keyPattern!: string;

  @IsIn(["low", "medium", "high", "critical"])
  severity!: PolicySeverity;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsBoolean()
  immutableInProduction?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  allowedTypes?: string[];

  @IsOptional()
  @IsNumber()
  minimumNumber?: number;

  @IsOptional()
  @IsNumber()
  maximumNumber?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  allowedValues?: ConfigurationValue[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  blockedValues?: ConfigurationValue[];
}

export class CreateFeatureFlagDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  key!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  service!: string;

  @IsIn(["development", "staging", "production"])
  environment!: ConfigurationEnvironment;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsIn([
    "all",
    "percentage",
    "environment",
    "service",
    "manual",
  ])
  strategy!: FeatureFlagStrategy;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  rolloutPercentage?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  targetServices?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(1000)
  @IsString({ each: true })
  targetUsers?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  createdBy!: string;
}

export class UpdateFeatureFlagDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsIn([
    "all",
    "percentage",
    "environment",
    "service",
    "manual",
  ])
  strategy?: FeatureFlagStrategy;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  rolloutPercentage?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  targetServices?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(1000)
  @IsString({ each: true })
  targetUsers?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  updatedBy!: string;
}

export class CreateKillSwitchDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  code!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  service!: string;

  @IsIn(["development", "staging", "production"])
  environment!: ConfigurationEnvironment;
}

export class ActivateKillSwitchDto {
  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  reason!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  activatedBy!: string;
}

export class ReleaseKillSwitchDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  releasedBy!: string;
}

export class RollbackConfigurationDto {
  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  reason!: string;

  @IsOptional()
  @IsBoolean()
  automatic?: boolean;
}

