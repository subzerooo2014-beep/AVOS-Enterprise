import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class CreateFactoryGeneratedCapabilityDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}