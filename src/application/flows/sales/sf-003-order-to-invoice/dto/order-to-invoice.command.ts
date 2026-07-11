import { IsOptional, IsString } from "class-validator";

export class OrderToInvoiceCommand {
  @IsString()
  orderId!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
