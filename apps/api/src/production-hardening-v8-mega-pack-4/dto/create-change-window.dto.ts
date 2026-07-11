import { Type } from "class-transformer";
import {
  IsArray,
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
  ChangeWindowType,
  GovernanceEnvironment,
  GovernanceRequestType,
  GovernanceRiskLevel,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CreateChangeWindowDto {
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

  @IsEnum(ChangeWindowType)
  type!: ChangeWindowType;

  @IsISO8601()
  startsAt!: string;

  @IsISO8601()
  endsAt!: string;

  @IsString()
  @MaxLength(100)
  timezone!: string;

  @IsOptional()
  @IsArray()
  @IsEnum(GovernanceRequestType, {
    each: true,
  })
  allowedRequestTypes?: GovernanceRequestType[];

  @IsOptional()
  @IsArray()
  @IsEnum(GovernanceRequestType, {
    each: true,
  })
  blockedRequestTypes?: GovernanceRequestType[];

  @IsEnum(GovernanceRiskLevel)
  maximumRiskLevel!: GovernanceRiskLevel;

  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  requiredApprovalCount?: number;

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
