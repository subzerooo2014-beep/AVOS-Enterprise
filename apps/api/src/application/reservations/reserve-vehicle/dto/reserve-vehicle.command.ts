import { IsOptional, IsString } from "class-validator";

export class ReserveVehicleCommand {
  @IsString()
  vehicleId!: string;

  @IsString()
  customerId!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
