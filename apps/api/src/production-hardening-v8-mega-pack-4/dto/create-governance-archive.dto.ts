import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import {
  GovernanceArchiveType,
  GovernanceDataClassification,
  GovernanceEnvironment,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CreateGovernanceArchiveDto {
  @IsEnum(GovernanceArchiveType)
  type!: GovernanceArchiveType;

  @IsString()
  @MaxLength(500)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsEnum(GovernanceDataClassification)
  classification!: GovernanceDataClassification;

  @IsOptional()
  @IsEnum(GovernanceEnvironment)
  environment?: GovernanceEnvironment;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  namespace?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sourceResourceIds?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(200)
  checkpointId?: string;

  @IsBoolean()
  compressed!: boolean;

  @IsBoolean()
  encrypted!: boolean;

  @IsBoolean()
  immutable!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  retentionPolicyId?: string;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
