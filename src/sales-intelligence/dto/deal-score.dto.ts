import { IsNumber, IsOptional, IsString } from "class-validator";

export class DealScoreDto {
  @IsOptional()
  @IsString()
  customerType?: string;

  @IsOptional()
  @IsNumber()
  vehiclePrice?: number;

  @IsOptional()
  @IsNumber()
  offeredPrice?: number;

  @IsOptional()
  @IsString()
  paymentType?: string;
}
