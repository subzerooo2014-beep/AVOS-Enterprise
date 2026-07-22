import { Injectable } from '@nestjs/common'; import { MobilityService } from './mobility.service';
@Injectable()
export class DemoService {
 constructor(private readonly mobility:MobilityService){}
 run(){const vehicle=this.mobility.createVehicle({make:'Toyota',model:'Land Cruiser',year:2024,mileage:18000,askingPrice:285000,currency:'AED'});const customer=this.mobility.createCustomer({name:'MVP Demo Customer',email:'demo@avos.local'});const pricing=this.mobility.pricing({vehicleId:vehicle.id});const listing=this.mobility.createListing({vehicleId:vehicle.id});const reservation=this.mobility.createReservation({vehicleId:vehicle.id,customerId:customer.id,expiresInMinutes:60});const purchase=this.mobility.createPurchase({vehicleId:vehicle.id,customerId:customer.id,offeredPrice:pricing.suggestedPrice,currency:vehicle.currency});return {workflow:['vehicle-created','knowledge-validated','pricing-analyzed','listing-published','reservation-confirmed','purchase-request-created'],vehicle,customer,pricing,listing,reservation,purchase,completedAt:new Date().toISOString()};}
}
