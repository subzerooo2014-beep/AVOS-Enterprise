import { Type } from "class-transformer";
import {
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
  GovernanceDecision,
  GovernanceEnvironment,
  GovernanceRequestType,
  GuardrailType,
} from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";

export const RUNTIME_GUARDRAIL_OPERATORS = [
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "in",
  "not_in",
  "exists",
  "contains",
] as const;

export type RuntimeGuardrailOperator =
  (typeof RUNTIME_GUARDRAIL_OPERATORS)[number];

export class RuntimeGuardrailConditionDto {
  @IsString()
  @MaxLength(300)
  field!: string;

  @IsIn(RUNTIME_GUARDRAIL_OPERATORS)
  operator!: RuntimeGuardrailOperator;

  @IsOptional()
  value?: unknown;
}

export class CreateRuntimeGuardrailDto {
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

  @IsEnum(GuardrailType)
  type!: GuardrailType;

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RuntimeGuardrailConditionDto)
  conditions!: RuntimeGuardrailConditionDto[];

  @IsEnum(GovernanceDecision)
  failureDecision!: GovernanceDecision;

  @IsBoolean()
  warningOnly!: boolean;

  @IsInt()
  @Min(0)
  priority!: number;

  @IsArray()
  @IsString({ each: true })
  requiredRoles!: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => GovernanceActorDto)
  actor!: GovernanceActorDto;
}
