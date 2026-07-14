import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MemoryVaultEntryDto {
  @IsString()
  id!: string;

  @IsString()
  category!: string;

  @IsString()
  contentHash!: string;

  @IsNumber()
  @Min(0)
  importance!: number;

  @IsString()
  createdAt!: string;

  @IsOptional()
  @IsString()
  expiresAt?: string;

  @IsBoolean()
  legalHold!: boolean;
}

export class MemoryVaultDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemoryVaultEntryDto)
  entries!: MemoryVaultEntryDto[];
}