import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class ReceivePaymentCommand {
  @IsString()
  invoiceId!: string;

  @IsNumber()
  @Min(0.01)
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
