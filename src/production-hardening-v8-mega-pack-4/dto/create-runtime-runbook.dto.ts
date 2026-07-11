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
  GovernanceRequestType,
  GovernanceRiskLevel,
  RuntimeRunbookStepType,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CreateRuntimeRunbookStepDto {
  @IsString()
  @MaxLength(200)
  id!: string;

  @IsString()
  @MaxLength(500)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsEnum(RuntimeRunbookStepType)
  type!: RuntimeRunbookStepType;

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

  @IsBoolean()
  continueOnFailure!: boolean;

  @IsOptional()
  @IsObject()
  condition?: Record<string, unknown>;

  @IsObject()
  parameters!: Record<string, unknown>;

  @IsOptional()
  @IsEnum(RuntimeRunbookStepType)
  rollbackStepType?: RuntimeRunbookStepType;

  @IsOptional()
  @IsObject()
  rollbackParameters?: Record<string, unknown>;
}

export class CreateRuntimeRunbookDto {
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

  @IsOptional()
  @IsEnum(GovernanceEnvironment)
  environment?: GovernanceEnvironment;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  namespace?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  service?: string;

  @IsArray()
  @IsEnum(GovernanceRequestType, { each: true })
  requestTypes!: GovernanceRequestType[];

  @IsEnum(GovernanceRiskLevel)
  minimumRiskLevel!: GovernanceRiskLevel;

  @IsEnum(GovernanceRiskLevel)
  maximumRiskLevel!: GovernanceRiskLevel;

  @IsBoolean()
  requiresApproval!: boolean;

  @IsArray()
  @IsString({ each: true })
  requiredRoles!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRuntimeRunbookStepDto)
  steps!: CreateRuntimeRunbookStepDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
