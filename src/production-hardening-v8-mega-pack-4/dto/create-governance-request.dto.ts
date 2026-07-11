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
  GovernanceEnvironment,
  GovernanceRequestType,
  GovernanceRiskLevel,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CreateGovernanceRequestDto {
  @IsEnum(GovernanceRequestType)
  type!: GovernanceRequestType;

  @IsString()
  @MaxLength(500)
  title!: string;

  @IsString()
  @MaxLength(8000)
  description!: string;

  @IsEnum(GovernanceEnvironment)
  environment!: GovernanceEnvironment;

  @IsString()
  @MaxLength(300)
  namespace!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  service?: string;

  @IsEnum(GovernanceRiskLevel)
  requestedRiskLevel!: GovernanceRiskLevel;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  changeWindowId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  maintenanceModeId?: string;

  @IsBoolean()
  rollbackPlanAvailable!: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  testCoverage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  blastRadius?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  businessCriticality?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  approvalsRequired?: number;

  @IsObject()
  payload!: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
