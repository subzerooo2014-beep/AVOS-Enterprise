import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CognitiveSignalDto {
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
}

export class RunCognitiveCycleDto {
  @IsString()
  objective!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CognitiveSignalDto)
  signals!: CognitiveSignalDto[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3650)
  horizonDays?: number;
}