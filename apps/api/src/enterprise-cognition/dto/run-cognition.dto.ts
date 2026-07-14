import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CognitionSignalDto {
  @IsString()
  id!: string;

  @IsString()
  domain!: string;

  @IsString()
  source!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  value!: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence!: number;

  @IsString()
  observedAt!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, string | number | boolean>;
}

export class RunCognitionDto {
  @IsString()
  objective!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CognitionSignalDto)
  signals!: CognitionSignalDto[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3650)
  horizonDays?: number;
}