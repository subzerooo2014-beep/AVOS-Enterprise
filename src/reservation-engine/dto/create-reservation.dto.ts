import { IsString, IsOptional } from "class-validator";

export class CreateReservationDto {

  @IsString()
  vehicleId!: string;

  @IsString()
  customerId!: string;

  @IsOptional()
  @IsString()
  notes?: string;

}
