import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateListingDto {
  @IsString()
  id!: string;

  @IsString()
  sellerId!: string;

  @IsOptional()
  @IsString()
  dealerId?: string;

  @IsString()
  vehicleId!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  currency!: string;

  @IsString()
  region!: string;

  @IsString()
  city!: string;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsNumber()
  @Min(0)
  mileage!: number;

  @IsInt()
  @Min(1900)
  year!: number;

  @IsString()
  make!: string;

  @IsString()
  model!: string;
}