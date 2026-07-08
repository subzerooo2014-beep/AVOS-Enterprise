import { IsOptional, IsString } from "class-validator";

export class CreateTrimDto {
  @IsString()
  modelId!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  engine?: string;

  @IsOptional()
  @IsString()
  gearbox?: string;

  @IsOptional()
  @IsString()
  fuelType?: string;
}
