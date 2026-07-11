import { IsOptional, IsString } from "class-validator";

export class StartSalesWorkflowDto {
  @IsString()
  customerId!: string;

  @IsOptional()
  @IsString()
  quoteId?: string;

  @IsOptional()
  @IsString()
  orderId?: string;
}
