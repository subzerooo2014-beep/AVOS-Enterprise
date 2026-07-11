import { IsOptional, IsString } from "class-validator";

export class CancelReservationCommand {
  @IsString()
  reservationId!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
