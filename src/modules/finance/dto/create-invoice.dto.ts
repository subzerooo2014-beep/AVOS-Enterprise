import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateInvoiceDto {
  @IsOptional()
  @IsString()
  saleId?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsNumber()
  taxAmount?: number;

  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

