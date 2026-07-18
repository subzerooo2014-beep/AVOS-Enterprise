import { IsObject, IsOptional, IsString } from "class-validator";

export class UpdateFactoryGeneratedCapabilityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}