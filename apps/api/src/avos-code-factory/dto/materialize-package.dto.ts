import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class MaterializePackageDto {
  @IsString()
  @IsNotEmpty()
  packageId!: string;

  @IsOptional()
  @IsString()
  targetDirectory?: string;

  @IsOptional()
  @IsBoolean()
  overwrite?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
