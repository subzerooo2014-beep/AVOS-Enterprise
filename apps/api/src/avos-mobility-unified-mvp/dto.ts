import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVehicleDto { make!:string; model!:string; year!:number; mileage!:number; askingPrice!:number; currency?:string; }
export class CreateCustomerDto { name!:string; email?:string; phone?:string; }
export class CreateListingDto { vehicleId!:string; title?:string; price?:number; currency?:string; }
export class CreateReservationDto { vehicleId!:string; customerId!:string; expiresInMinutes?:number; }
export class CreatePurchaseRequestDto { vehicleId!:string; customerId!:string; offeredPrice!:number; currency?:string; }
export class PricingDto { vehicleId!:string; }
export class RecommendationDto { budget?:number; make?:string; }
export class CertificationDto {
  @IsString()
  @IsNotEmpty()
  approvedBy!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
