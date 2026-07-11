import {
  IsArray,
  IsBoolean,
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

export class CreateAutomatedRemediationActionDto {
  @IsString()
  name!: string;

  @IsString()
  handler!: string;

  @IsInt()
  @Min(1)
  order!: number;

  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  retryLimit?: number;

  @IsOptional()
  @IsObject()
  configuration?: Record<string, unknown>;
}

export class CreateAutomatedRemediationDto {
  @IsString()
  sourceType!: string;

  @IsString()
  sourceId!: string;

  @IsString()
  title!: string;

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

  @IsString()
  owner!: string;

  @IsInt()
  @Min(1)
  @Max(100)
  priority!: number;

  @IsOptional()
  @IsString()
  dueAt?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAutomatedRemediationActionDto)
  actions!: CreateAutomatedRemediationActionDto[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
