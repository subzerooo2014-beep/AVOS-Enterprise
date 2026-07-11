import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  invoiceId!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

