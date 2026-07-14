import {
  IsArray,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ExternalSignalDto {
  @IsString()
  id!: string;

  @IsString()
  source!: string;

  @IsString()
  domain!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  value!: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence!: number;

  @IsString()
  observedAt!: string;
}

export class ExternalIntelligenceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExternalSignalDto)
  signals!: ExternalSignalDto[];
}