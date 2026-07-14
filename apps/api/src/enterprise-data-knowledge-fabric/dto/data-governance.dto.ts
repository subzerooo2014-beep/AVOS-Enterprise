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

export class DataAssetDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  domain!: string;

  @IsString()
  owner!: string;

  @IsIn(['public', 'internal', 'confidential', 'restricted'])
  classification!: 'public' | 'internal' | 'confidential' | 'restricted';

  @IsNumber()
  @Min(0)
  @Max(100)
  qualityScore!: number;

  @IsNumber()
  @Min(0)
  freshnessMinutes!: number;

  @IsString()
  region!: string;
}

export class DataGovernanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataAssetDto)
  assets!: DataAssetDto[];
}