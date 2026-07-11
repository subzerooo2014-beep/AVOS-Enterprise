import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import {
  CapacityMetricType,
  GovernanceEnvironment,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CapacityPolicyThresholdDto {
  @IsNumber()
  warning!: number;

  @IsNumber()
  critical!: number;

  @IsNumber()
  scaleOut!: number;

  @IsOptional()
  @IsNumber()
  scaleIn?: number;
}

export class CreateCapacityPolicyDto {
  @IsString()
  @MaxLength(200)
  key!: string;

  @IsString()
  @MaxLength(500)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsEnum(GovernanceEnvironment)
  environment!: GovernanceEnvironment;

  @IsString()
  @MaxLength(300)
  namespace!: string;

  @IsString()
  @MaxLength(300)
  service!: string;

  @IsEnum(CapacityMetricType)
  metricType!: CapacityMetricType;

  @IsString()
  @MaxLength(300)
  metricName!: string;

  @ValidateNested()
  @Type(() => CapacityPolicyThresholdDto)
  thresholds!: CapacityPolicyThresholdDto;

  @IsInt()
  @Min(1)
  minimumInstances!: number;

  @IsInt()
  @Min(1)
  maximumInstances!: number;

  @IsInt()
  @Min(1)
  @Max(100)
  scaleStep!: number;

  @IsInt()
  @Min(0)
  cooldownSeconds!: number;

  @IsBoolean()
  allowAutomaticScaling!: boolean;

  @IsBoolean()
  blockChangesWhenCritical!: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
