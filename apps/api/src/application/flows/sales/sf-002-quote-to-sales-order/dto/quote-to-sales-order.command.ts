import { IsOptional, IsString } from "class-validator";

export class QuoteToSalesOrderCommand {
  @IsString()
  quoteId!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
