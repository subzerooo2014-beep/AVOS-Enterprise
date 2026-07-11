import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import {
  GovernanceEnvironment,
  GovernanceRiskLevel,
  RecoveryActionType,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CreateRecoveryActionDto {
  @IsEnum(RecoveryActionType)
  type!: RecoveryActionType;

  @IsString()
  @MaxLength(500)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsString()
  @MaxLength(1000)
  target!: string;

  @IsInt()
  @Min(0)
  order!: number;

  @IsBoolean()
  required!: boolean;

  @IsInt()
  @Min(1)
  @Max(3600)
  timeoutSeconds!: number;

  @IsInt()
  @Min(0)
  @Max(20)
  retryLimit!: number;

  @IsObject()
  parameters!: Record<string, unknown>;

  @IsOptional()
  @IsEnum(RecoveryActionType)
  rollbackActionType?: RecoveryActionType;

  @IsOptional()
  @IsObject()
  rollbackParameters?: Record<string, unknown>;
}

export class CreateRecoveryPlanDto {
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

  @IsOptional()
  @IsString()
  @MaxLength(300)
  service?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  sourceNodeId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  cascadeAnalysisId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  governanceRequestId?: string;

  @IsEnum(GovernanceRiskLevel)
  riskLevel!: GovernanceRiskLevel;

  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  approvalsRequired?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecoveryActionDto)
  actions!: CreateRecoveryActionDto[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
