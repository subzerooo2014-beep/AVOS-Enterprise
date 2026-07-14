import {
  IsArray,
  IsIn,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EcosystemPartnerDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  region!: string;

  @IsString()
  category!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  trustScore!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  performanceScore!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  integrationScore!: number;

  @IsIn([
    'prospect',
    'onboarding',
    'active',
    'at-risk',
    'suspended',
    'offboarded',
  ])
  status!:
    | 'prospect'
    | 'onboarding'
    | 'active'
    | 'at-risk'
    | 'suspended'
    | 'offboarded';
}

export class PartnerIntelligenceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EcosystemPartnerDto)
  partners!: EcosystemPartnerDto[];
}