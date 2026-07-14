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

export class StrategyObjectiveDto {
  @IsString()
  id!: string;

  @IsString()
  title!: string;

  @IsString()
  owner!: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  priority!: number;

  @IsNumber()
  targetValue!: number;

  @IsNumber()
  currentValue!: number;

  @IsString()
  dueDate!: string;
}

export class StrategyEvaluationDto {
  @IsString()
  strategyName!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StrategyObjectiveDto)
  objectives!: StrategyObjectiveDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  constraints?: string[];
}