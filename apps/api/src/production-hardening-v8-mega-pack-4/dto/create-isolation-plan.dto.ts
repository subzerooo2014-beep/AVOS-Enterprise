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
  IsolationStrategy,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export class CreateIsolationRuleDto {
  @IsString()
  @MaxLength(200)
  nodeId!: string;

  @IsEnum(IsolationStrategy)
  strategy!: IsolationStrategy;

  @IsInt()
  @Min(0)
  @Max(100)
  trafficPercentage!: number;

  @IsBoolean()
  blockIncomingTraffic!: boolean;

  @IsBoolean()
  blockOutgoingTraffic!: boolean;

  @IsBoolean()
  pauseBackgroundJobs!: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disableDependencies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preserveDependencies?: string[];

  @IsString()
  @MaxLength(4000)
  reason!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class CreateIsolationPlanDto {
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
  @MaxLength(200)
  sourceNodeId!: string;

  @IsEnum(IsolationStrategy)
  strategy!: IsolationStrategy;

  @IsEnum(GovernanceRiskLevel)
  riskLevel!: GovernanceRiskLevel;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIsolationRuleDto)
  rules!: CreateIsolationRuleDto[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
