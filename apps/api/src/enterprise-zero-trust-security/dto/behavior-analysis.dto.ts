import {
  IsArray,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BehaviorSignalDto {
  @IsString()
  id!: string;

  @IsString()
  actorId!: string;

  @IsString()
  event!: string;

  @IsNumber()
  @Min(0)
  frequency!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  deviationScore!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  riskScore!: number;

  @IsString()
  observedAt!: string;
}

export class BehaviorAnalysisDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BehaviorSignalDto)
  signals!: BehaviorSignalDto[];
}