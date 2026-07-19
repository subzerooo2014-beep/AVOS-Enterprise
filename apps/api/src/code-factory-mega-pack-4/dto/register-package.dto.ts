import { IsArray, IsObject, IsOptional, IsString } from "class-validator";

export class RegisterPackageDto {
  @IsString()
  name!: string;

  @IsString()
  version!: string;

  @IsArray()
  @IsString({ each: true })
  artifactIds!: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}