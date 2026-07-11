import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateWorkflowStepDto {
  @IsString()
  name!: string;

  @IsIn([
    "action",
    "approval",
    "condition",
    "notification",
    "delay",
    "evidence",
    "remediation",
  ])
  stepType!:
    | "action"
    | "approval"
    | "condition"
    | "notification"
    | "delay"
    | "evidence"
    | "remediation";

  @IsString()
  handler!: string;

  @IsInt()
  @Min(1)
  order!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  timeoutSeconds?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  retryLimit?: number;

  @IsOptional()
  @IsBoolean()
  continueOnFailure?: boolean;

  @IsOptional()
  @IsObject()
  configuration?: Record<string, unknown>;
}

export class CreateWorkflowDefinitionDto {
  @IsString()
  workflowCode!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  triggerType!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateWorkflowStepDto)
  steps!: CreateWorkflowStepDto[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
