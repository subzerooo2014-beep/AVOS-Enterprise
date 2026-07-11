import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { DiscountType, PaymentPlanType } from '../constants/sales.enums';

export class CreateQuoteDto {
  @IsInt()
  vehicleId!: number;

  @IsOptional()
  @IsInt()
  customerId?: number;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsNumber()
  @Min(0)
  basePrice!: number;

  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  taxRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fees?: number;

  @IsOptional()
  @IsEnum(PaymentPlanType)
  paymentPlanType?: PaymentPlanType;

  @IsOptional()
  @IsInt()
  @Min(1)
  validityDays?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
