import {
  IsISO8601,
  IsNumber,
  IsObject,
  IsOptional,
} from "class-validator";

export class EvaluateRuntimeSloDto {
  @IsNumber()
  actualValue!: number;

  @IsOptional()
  @IsISO8601()
  observedAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
