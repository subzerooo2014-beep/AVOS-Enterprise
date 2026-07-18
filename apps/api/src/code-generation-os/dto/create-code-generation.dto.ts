import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class CreateCodeGenerationDto {
  @IsString()
  @IsNotEmpty()
  blueprintId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  namespace!: string;

  @IsString()
  @IsNotEmpty()
  targetRoot!: string;

  @IsArray()
  artifacts!: Array<Record<string, unknown>>;

  @IsArray()
  @IsOptional()
  requestedCapabilities: string[] = [];

  @IsObject()
  @IsOptional()
  metadata: Record<string, unknown> = {};
}
