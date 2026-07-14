import {
  IsArray,
  IsBoolean,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FoundationModuleDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  domain!: string;

  @IsBoolean()
  registered!: boolean;

  @IsBoolean()
  buildPassing!: boolean;

  @IsBoolean()
  testsPassing!: boolean;

  @IsBoolean()
  verificationPassing!: boolean;

  @IsArray()
  @IsString({ each: true })
  dependencies!: string[];
}

export class FoundationAssessmentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FoundationModuleDto)
  modules!: FoundationModuleDto[];
}