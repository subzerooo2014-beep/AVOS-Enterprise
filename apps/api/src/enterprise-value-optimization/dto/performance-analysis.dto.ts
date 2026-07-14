import {
  IsArray,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PerformanceMetricDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsNumber()
  actual!: number;

  @IsNumber()
  target!: number;

  @IsNumber()
  @Min(0)
  weight!: number;

  @IsString()
  unit!: string;
}

export class PerformanceAnalysisDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerformanceMetricDto)
  metrics!: PerformanceMetricDto[];
}