import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StrategyScenarioDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsObject()
  assumptions!: Record<string, number>;

  @IsNumber()
  expectedValue!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  riskScore!: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence!: number;
}

export class StrategySimulationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StrategyScenarioDto)
  scenarios!: StrategyScenarioDto[];
}