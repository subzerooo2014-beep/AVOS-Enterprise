import {
  IsArray,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CriticalDependencyDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  domain!: string;

  @IsNumber()
  @Min(0)
  criticality!: number;

  @IsNumber()
  @Min(0)
  recoveryTimeObjectiveMinutes!: number;

  @IsNumber()
  @Min(0)
  recoveryPointObjectiveMinutes!: number;

  @IsArray()
  @IsString({ each: true })
  dependencies!: string[];
}

export class ContinuityAnalysisDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriticalDependencyDto)
  dependencies!: CriticalDependencyDto[];
}