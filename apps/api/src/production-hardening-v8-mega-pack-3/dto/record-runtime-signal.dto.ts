import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsISO8601,
  MaxLength,
} from "class-validator";
import {
  RuntimeEnvironment,
  RuntimeSignalStatus,
  RuntimeSignalType,
} from "../contracts/runtime-resilience.enums";

export class RecordRuntimeSignalDto {
  @IsString()
  @MaxLength(300)
  source!: string;

  @IsEnum(RuntimeEnvironment)
  environment!: RuntimeEnvironment;

  @IsString()
  @MaxLength(300)
  namespace!: string;

  @IsString()
  @MaxLength(300)
  service!: string;

  @IsEnum(RuntimeSignalType)
  type!: RuntimeSignalType;

  @IsEnum(RuntimeSignalStatus)
  status!: RuntimeSignalStatus;

  @IsNumber()
  value!: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  unit?: string;

  @IsOptional()
  @IsNumber()
  thresholdWarning?: number;

  @IsOptional()
  @IsNumber()
  thresholdCritical?: number;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  message?: string;

  @IsOptional()
  @IsObject()
  labels?: Record<string, string>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsISO8601()
  observedAt?: string;
}
