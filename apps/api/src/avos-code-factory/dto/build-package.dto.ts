import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class BuildPackageDto {
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
  @IsBoolean()
  installDependencies?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  commands?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
