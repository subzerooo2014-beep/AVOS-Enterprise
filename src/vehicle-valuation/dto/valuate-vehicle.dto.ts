import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class ValuateVehicleDto {
  @IsString()
  make!: string;

  @IsString()
  model!: string;

  @IsInt()
  @Min(1900)
  year!: number;

  @IsOptional()
  @IsNumber()
  mileage?: number;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsNumber()
  marketPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  demandScore?: number;
}
