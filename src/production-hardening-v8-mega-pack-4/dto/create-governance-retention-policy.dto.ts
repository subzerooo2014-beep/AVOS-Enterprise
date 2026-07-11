import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import {
  GovernanceArchiveType,
  GovernanceDataClassification,
  GovernanceEnvironment,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CreateGovernanceRetentionPolicyDto {
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

  @IsArray()
  @IsEnum(GovernanceArchiveType, { each: true })
  archiveTypes!: GovernanceArchiveType[];

  @IsArray()
  @IsEnum(GovernanceDataClassification, { each: true })
  classifications!: GovernanceDataClassification[];

  @IsInt()
  @Min(1)
  retentionDays!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  archiveAfterDays?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  compressAfterDays?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  redactAfterDays?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  deleteAfterDays?: number;

  @IsBoolean()
  legalHold!: boolean;

  @IsBoolean()
  immutable!: boolean;

  @IsOptional()
  @IsEnum(GovernanceEnvironment)
  environment?: GovernanceEnvironment;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  namespace?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
