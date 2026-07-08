import { IsOptional, IsString } from "class-validator";

export class InventoryInsightDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
