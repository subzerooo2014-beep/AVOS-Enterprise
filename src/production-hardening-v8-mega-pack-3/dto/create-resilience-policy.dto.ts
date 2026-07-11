import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import {
  ResilienceActionType,
  RuntimeDecision,
  RuntimeEnvironment,
  RuntimeRiskLevel,
} from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";

export const RESILIENCE_POLICY_OPERATORS = [
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "in",
  "not_in",
  "contains",
  "exists",
] as const;

export type ResiliencePolicyOperator =
  (typeof RESILIENCE_POLICY_OPERATORS)[number];

export class ResiliencePolicyConditionDto {
  @IsString()
  @MaxLength(300)
  field!: string;

  @IsIn(RESILIENCE_POLICY_OPERATORS)
  operator!: ResiliencePolicyOperator;

  @IsOptional()
  value?: unknown;
}

export class ResiliencePolicyRuleDto {
  @IsString()
  @MaxLength(200)
  id!: string;

  @IsString()
  @MaxLength(300)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsInt()
  @Min(0)
  priority!: number;

  @IsBoolean()
  enabled!: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResiliencePolicyConditionDto)
  conditions!: ResiliencePolicyConditionDto[];

  @IsEnum(RuntimeDecision)
  decision!: RuntimeDecision;

  @IsEnum(RuntimeRiskLevel)
  riskLevel!: RuntimeRiskLevel;

  @IsOptional()
  @IsInt()
  @Min(0)
  requiredApprovals?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(ResilienceActionType, { each: true })
  actionTypes?: ResilienceActionType[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class CreateResiliencePolicyDto {
  @IsString()
  @MaxLength(200)
  key!: string;

  @IsString()
  @MaxLength(300)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsOptional()
  @IsEnum(RuntimeEnvironment)
  environment?: RuntimeEnvironment;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  namespace?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ResiliencePolicyRuleDto)
  rules!: ResiliencePolicyRuleDto[];

  @IsEnum(RuntimeDecision)
  defaultDecision!: RuntimeDecision;

  @IsEnum(RuntimeRiskLevel)
  defaultRiskLevel!: RuntimeRiskLevel;

  @ValidateNested()
  @Type(() => RuntimeActorDto)
  actor!: RuntimeActorDto;
}
