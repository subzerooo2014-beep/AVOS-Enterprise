import {
  IsArray,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateRiskDto {
  @IsString()
  riskCode!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  category!: string;

  @IsString()
  owner!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  likelihood!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  impact!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(25)
  residualScore?: number;

  @IsOptional()
  @IsIn([
    "identified",
    "assessed",
    "mitigating",
    "accepted",
    "transferred",
    "closed",
  ])
  status?:
    | "identified"
    | "assessed"
    | "mitigating"
    | "accepted"
    | "transferred"
    | "closed";

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  controls?: string[];

  @IsOptional()
  @IsString()
  treatmentPlan?: string;

  @IsOptional()
  @IsString()
  reviewDate?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
