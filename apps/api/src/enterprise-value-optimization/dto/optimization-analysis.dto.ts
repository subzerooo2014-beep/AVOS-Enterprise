import {
  IsArray,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ResourceUsageDto {
  @IsString()
  id!: string;

  @IsString()
  resource!: string;

  @IsNumber()
  @Min(0)
  capacity!: number;

  @IsNumber()
  @Min(0)
  used!: number;

  @IsNumber()
  @Min(0)
  cost!: number;
}

export class ProcessStageDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  throughput!: number;

  @IsNumber()
  @Min(0)
  waitTime!: number;

  @IsNumber()
  @Min(0)
  errorRate!: number;
}

export class OptimizationAnalysisDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceUsageDto)
  resources!: ResourceUsageDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcessStageDto)
  stages!: ProcessStageDto[];
}