import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class DecisionOptionDto {
  @IsString() @IsNotEmpty() id!: string;
  @IsString() @IsNotEmpty() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsNumber() expectedBenefit!: number;
  @IsNumber() expectedCost!: number;
  @IsNumber() @Min(0) @Max(100) risk!: number;
  @IsNumber() @Min(0) @Max(100) confidence!: number;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateEnterpriseDecisionDto {
  @IsString() @IsNotEmpty() subject!: string;
  @IsOptional() @IsObject() context?: Record<string, unknown>;
  @IsArray() @ValidateNested({ each: true }) @Type(() => DecisionOptionDto) options!: DecisionOptionDto[];
  @IsOptional() @IsBoolean() requireHumanApproval?: boolean;
}

export class SelectDecisionOptionDto {
  @IsString() @IsNotEmpty() optionId!: string;
  @IsOptional() @IsString() approvedBy?: string;
}

export class EvaluateDecisionDto {
  @IsOptional() @IsObject() contextPatch?: Record<string, unknown>;
}