import { IsNumber, IsString, Min } from 'class-validator';

export class ServiceQuoteDto {
  @IsString()
  id!: string;

  @IsString()
  bookingId!: string;

  @IsNumber()
  @Min(0)
  partsCost!: number;

  @IsNumber()
  @Min(0)
  laborCost!: number;

  @IsNumber()
  @Min(0)
  taxAmount!: number;

  @IsNumber()
  @Min(0)
  discountAmount!: number;

  @IsString()
  currency!: string;
}