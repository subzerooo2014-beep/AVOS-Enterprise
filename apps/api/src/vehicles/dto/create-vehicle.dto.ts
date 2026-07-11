import { IsInt, IsOptional, IsString, Min, Max } from "class-validator";

export class CreateVehicleDto {
  @IsString()
  vin!: string;

  @IsString()
  make!: string;

  @IsString()
  model!: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  year!: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
