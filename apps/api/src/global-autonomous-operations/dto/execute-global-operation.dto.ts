import {
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CapacityPoolDto {
  @IsString()
  id!: string;

  @IsString()
  region!: string;

  @IsNumber()
  @Min(0)
  capacity!: number;

  @IsNumber()
  @Min(0)
  committed!: number;

  @IsNumber()
  @Min(0)
  unitCost!: number;
}

export class ExecuteGlobalOperationDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  region!: string;

  @IsInt()
  @Min(1)
  @Max(100)
  priority!: number;

  @IsNumber()
  @Min(0)
  requiredCapacity!: number;

  @IsArray()
  @IsString({ each: true })
  requiredServices!: string[];

  @IsArray()
  @IsString({ each: true })
  dependencies!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CapacityPoolDto)
  capacityPools!: CapacityPoolDto[];
}