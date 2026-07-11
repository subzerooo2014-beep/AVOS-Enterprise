import {
  IsIn,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateDriftEventDto {
  @IsString()
  domain!: string;

  @IsString()
  resource!: string;

  @IsString()
  description!: string;

  @IsIn(["informational", "low", "medium", "high", "critical"])
  severity!: "informational" | "low" | "medium" | "high" | "critical";

  @IsOptional()
  previousState?: unknown;

  @IsOptional()
  currentState?: unknown;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
