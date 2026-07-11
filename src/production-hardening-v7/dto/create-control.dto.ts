import {
  IsBoolean,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateControlDto {
  @IsString()
  controlCode!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  framework!: string;

  @IsString()
  category!: string;

  @IsIn(["informational", "low", "medium", "high", "critical"])
  severity!: "informational" | "low" | "medium" | "high" | "critical";

  @IsString()
  validationType!: string;

  @IsOptional()
  expectedValue?: unknown;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
