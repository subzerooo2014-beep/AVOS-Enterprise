import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateRemediationDto {
  @IsIn(["control_failure", "compliance_drift", "risk", "incident"])
  sourceType!:
    | "control_failure"
    | "compliance_drift"
    | "risk"
    | "incident";

  @IsString()
  sourceId!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsIn(["informational", "low", "medium", "high", "critical"])
  severity!: "informational" | "low" | "medium" | "high" | "critical";

  @IsString()
  owner!: string;

  @IsInt()
  @Min(1)
  @Max(100)
  priority!: number;

  @IsOptional()
  @IsString()
  dueAt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  actions?: string[];
}
