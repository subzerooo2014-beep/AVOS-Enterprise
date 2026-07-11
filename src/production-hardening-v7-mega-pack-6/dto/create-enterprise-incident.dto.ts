import {
  IsArray,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateEnterpriseIncidentDto {
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
  source!: string;

  @IsOptional()
  @IsString()
  detectedAt?: string;

  @IsOptional()
  @IsString()
  commander?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  affectedServices?: string[];

  @IsString()
  businessImpact!: string;

  @IsString()
  technicalImpact!: string;

  @IsOptional()
  @IsString()
  regulatoryImpact?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  evidenceReferences?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
