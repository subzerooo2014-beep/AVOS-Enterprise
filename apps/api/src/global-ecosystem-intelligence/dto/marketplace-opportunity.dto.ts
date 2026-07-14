import {
  IsArray,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MarketplaceOpportunityDto {
  @IsString()
  id!: string;

  @IsString()
  market!: string;

  @IsString()
  category!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  demandScore!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  supplyScore!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  marginScore!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  competitionScore!: number;
}

export class MarketplaceOpportunityAnalysisDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketplaceOpportunityDto)
  opportunities!: MarketplaceOpportunityDto[];
}