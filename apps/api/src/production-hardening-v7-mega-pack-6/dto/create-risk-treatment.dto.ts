import {
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

export class CreateRiskTreatmentTaskDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

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
  dependencies?: string[];
}

export class CreateRiskTreatmentDto {
  @IsString()
  riskId!: string;

  @IsOptional()
  @IsString()
  riskCode?: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsIn([
    "avoid",
    "mitigate",
    "transfer",
    "accept",
    "monitor",
  ])
  strategy!:
    | "avoid"
    | "mitigate"
    | "transfer"
    | "accept"
    | "monitor";

  @IsString()
  owner!: string;

  @IsInt()
  @Min(0)
  @Max(25)
  targetResidualScore!: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRiskTreatmentTaskDto)
  tasks?: CreateRiskTreatmentTaskDto[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
