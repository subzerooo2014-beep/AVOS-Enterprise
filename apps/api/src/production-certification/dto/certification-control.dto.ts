import {
  IsArray,
  IsBoolean,
  IsString,
} from 'class-validator';

export class CertificationControlDto {
  @IsString()
  id!: string;

  @IsString()
  domain!: string;

  @IsBoolean()
  required!: boolean;

  @IsBoolean()
  passed!: boolean;

  @IsArray()
  @IsString({ each: true })
  evidence!: string[];
}