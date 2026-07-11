import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSalesOrderDto {

  @IsString()
  customerId!: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

}
