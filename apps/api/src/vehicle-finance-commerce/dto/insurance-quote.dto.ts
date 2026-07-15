import {
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class InsuranceQuoteDto {
  @IsString()
  id!: string;

  @IsString()
  providerId!: string;

  @IsString()
  listingId!: string;

  @IsString()
  buyerId!: string;

  @IsNumber()
  @Min(0)
  annualPremium!: number;

  @IsNumber()
  @Min(0)
  deductible!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  coverageScore!: number;

  @IsString()
  validUntil!: string;
}