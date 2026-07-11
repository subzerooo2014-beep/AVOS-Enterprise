import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateBaselineControlDto {
  @IsString()
  controlCode!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsIn([
    "informational",
    "low",
    "medium",
    "high",
    "critical",
  ])
  severity!:
    | "informational"
    | "low"
    | "medium"
    | "high"
    | "critical";

  @IsIn([
    "equals",
    "not_equals",
    "contains",
    "exists",
    "not_exists",
    "greater_than",
    "less_than",
    "custom",
  ])
  comparisonType!:
    | "equals"
    | "not_equals"
    | "contains"
    | "exists"
    | "not_exists"
    | "greater_than"
    | "less_than"
    | "custom";

  @IsOptional()
  expectedValue?: unknown;

  @IsString()
  resourcePath!: string;

  @IsOptional()
  enabled?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class CreateComplianceBaselineDto {
  @IsString()
  baselineCode!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  domain!: string;

  @IsString()
  owner!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000000)
  version?: number;

  @IsOptional()
  @IsString()
  effectiveFrom?: string;

  @IsOptional()
  @IsString()
  effectiveUntil?: string;

  @IsOptional()
  @IsString()
  supersedesBaselineId?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateBaselineControlDto)
  controls!: CreateBaselineControlDto[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
