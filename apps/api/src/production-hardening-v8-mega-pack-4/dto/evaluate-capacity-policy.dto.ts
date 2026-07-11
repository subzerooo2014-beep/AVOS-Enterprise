import {
  IsInt,
  IsISO8601,
  IsNumber,
  IsObject,
  IsOptional,
  Min,
} from "class-validator";

export class EvaluateCapacityPolicyDto {
  @IsNumber()
  actualValue!: number;

  @IsInt()
  @Min(0)
  currentInstances!: number;

  @IsOptional()
  @IsISO8601()
  observedAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
