import {
  IsArray,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OperationalRiskDto {
  @IsString()
  id!: string;

  @IsString()
  domain!: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  probability!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  impact!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  detectability!: number;

  @IsString()
  mitigation!: string;
}

export class RiskAnalysisDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperationalRiskDto)
  risks!: OperationalRiskDto[];
}