import { IsIn, IsObject, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterPlatformDependencyDto {
  @IsString()
  @MinLength(1)
  sourceServiceId!: string;

  @IsString()
  @MinLength(1)
  targetServiceId!: string;

  @IsOptional()
  @IsIn(["required", "optional", "runtime"])
  type?: "required" | "optional" | "runtime";

  @IsOptional()
  @IsString()
  minimumVersion?: string;

  @IsOptional()
  @IsIn(["active", "disabled"])
  status?: "active" | "disabled";

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}