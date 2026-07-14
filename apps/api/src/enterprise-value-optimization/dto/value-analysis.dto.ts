import {
  IsArray,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CostRecordDto {
  @IsString()
  id!: string;

  @IsString()
  category!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  avoidablePercent!: number;
}

export class RevenueRecordDto {
  @IsString()
  id!: string;

  @IsString()
  stream!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsNumber()
  growthRate!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  marginPercent!: number;
}

export class ValueAnalysisDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CostRecordDto)
  costs!: CostRecordDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RevenueRecordDto)
  revenues!: RevenueRecordDto[];
}