import { IsIn, IsString } from 'class-validator';

export class ServiceBookingDto {
  @IsString()
  id!: string;

  @IsString()
  customerId!: string;

  @IsString()
  providerId!: string;

  @IsString()
  serviceId!: string;

  @IsString()
  vehicleId!: string;

  @IsString()
  scheduledAt!: string;

  @IsIn(['requested', 'confirmed', 'in-progress', 'completed', 'cancelled'])
  status!: 'requested' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
}