import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ResourcePoolDto {
  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  available!: number;

  @IsNumber()
  @Min(0)
  committed!: number;

  @IsString()
  unit!: string;
}

export class ExecuteMissionDto {
  @IsString()
  id!: string;

  @IsString()
  objective!: string;

  @IsString()
  owner!: string;

  @IsInt()
  @Min(1)
  @Max(100)
  priority!: number;

  @IsArray()
  @IsString({ each: true })
  requiredCapabilities!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dependencies?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourcePoolDto)
  resources!: ResourcePoolDto[];
}