import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
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
  GovernanceScheduleType,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CreateGovernanceScheduleDto {
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

  @IsEnum(GovernanceScheduleType)
  type!: GovernanceScheduleType;

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

  @IsOptional()
  @IsString()
  @MaxLength(300)
  targetId?: string;

  @IsOptional()
  @IsISO8601()
  runAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  intervalSeconds?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maximumRuns?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  retryLimit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  retryDelaySeconds?: number;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
