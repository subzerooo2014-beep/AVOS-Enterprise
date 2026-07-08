import { IsOptional, IsString } from "class-validator";

export class VehicleAiRequestDto {
  @IsOptional() @IsString()
  vin?: string;

  @IsOptional() @IsString()
  imageUrl?: string;

  @IsOptional() @IsString()
  make?: string;

  @IsOptional() @IsString()
  model?: string;
}
