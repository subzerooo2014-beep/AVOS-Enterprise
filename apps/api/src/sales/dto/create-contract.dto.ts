import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaymentPlanType } from '../constants/sales.enums';

export class CreateContractDto {
  @IsOptional()
  @IsInt()
  quoteId?: number;

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
  totalAmount!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  downPayment?: number;

  @IsOptional()
  @IsEnum(PaymentPlanType)
  paymentPlanType?: PaymentPlanType;

  @IsOptional()
  @IsInt()
  @Min(1)
  installmentMonths?: number;

  @IsOptional()
  @IsString()
  terms?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
