import {
  IsArray,
  IsBoolean,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReleaseEvidenceDto {
  @IsString()
  id!: string;

  @IsString()
  category!: string;

  @IsString()
  description!: string;

  @IsString()
  path!: string;

  @IsBoolean()
  verified!: boolean;

  @IsString()
  createdAt!: string;
}

export class ReleaseEvidenceBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReleaseEvidenceDto)
  evidence!: ReleaseEvidenceDto[];
}