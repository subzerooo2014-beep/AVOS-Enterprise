import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MemoryNodeDto {
  @IsString()
  id!: string;

  @IsString()
  type!: string;

  @IsString()
  label!: string;

  @IsNumber()
  @Min(0)
  importance!: number;

  @IsString()
  lastAccessedAt!: string;

  @IsObject()
  attributes!: Record<string, string | number | boolean>;
}

export class MemoryEdgeDto {
  @IsString()
  id!: string;

  @IsString()
  from!: string;

  @IsString()
  to!: string;

  @IsString()
  relation!: string;

  @IsNumber()
  @Min(0)
  weight!: number;
}

export class MemoryGraphDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemoryNodeDto)
  nodes!: MemoryNodeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemoryEdgeDto)
  edges!: MemoryEdgeDto[];
}