import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateInventoryDto {
  @IsString()
  vehicleId!: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  location?: string;
}
