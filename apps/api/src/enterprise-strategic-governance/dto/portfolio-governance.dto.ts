import {
  IsArray,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PortfolioInitiativeDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  strategicFit!: number;

  @IsNumber()
  @Min(0)
  expectedValue!: number;

  @IsNumber()
  @Min(0)
  cost!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  riskScore!: number;

  @IsArray()
  @IsString({ each: true })
  dependencies!: string[];
}

export class PortfolioGovernanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PortfolioInitiativeDto)
  initiatives!: PortfolioInitiativeDto[];
}