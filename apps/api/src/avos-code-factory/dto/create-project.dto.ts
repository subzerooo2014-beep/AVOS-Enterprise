import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  objective!: string;

  @IsOptional()
  @IsString()
  rootPath?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
