import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class CreateFactoryRuntimeSmokeCapabilityDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}