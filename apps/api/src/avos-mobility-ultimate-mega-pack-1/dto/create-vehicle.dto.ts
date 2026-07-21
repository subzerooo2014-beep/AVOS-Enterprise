import { IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateVehicleDto {
  @IsOptional()
  @IsString()
  vin?: string;

  @IsString()
  make!: string;

  @IsString()
  model!: string;

  @IsInt()
  @Min(1886)
  @Max(2100)
  year!: number;

  @IsOptional()
  @IsString()
  trim?: string;

  @IsNumber()
  @Min(0)
  mileageKm!: number;

  @IsOptional()
  @IsString()
  bodyType?: string;

  @IsOptional()
  @IsString()
  fuelType?: string;

  @IsOptional()
  @IsString()
  transmission?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsIn(['new', 'used', 'certified'])
  condition!: 'new' | 'used' | 'certified';

  @IsNumber()
  @Min(0)
  priceAmount!: number;

  @IsString()
  currency!: string;

  @IsOptional()
  @IsString()
  dealerId?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsString()
  countryCode!: string;
}