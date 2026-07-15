import {
  IsInt,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class FinancingApplicationDto {
  @IsString()
  id!: string;

  @IsString()
  buyerId!: string;

  @IsString()
  listingId!: string;

  @IsNumber()
  @Min(0)
  vehiclePrice!: number;

  @IsNumber()
  @Min(0)
  downPayment!: number;

  @IsInt()
  @Min(1)
  termMonths!: number;

  @IsNumber()
  @Min(0)
  monthlyIncome!: number;
}