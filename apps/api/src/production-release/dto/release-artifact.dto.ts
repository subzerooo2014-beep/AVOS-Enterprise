import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class ReleaseArtifactDto {
  @IsString()
  id!: string;

  @IsString()
  type!: string;

  @IsString()
  path!: string;

  @IsOptional()
  @IsString()
  checksum?: string;

  @IsBoolean()
  required!: boolean;
}