import { Injectable } from '@nestjs/common';
import { Vehicle,Customer,Listing,Reservation,PurchaseRequest } from './types';
@Injectable()
export class MobilityStoreService {
 readonly vehicles=new Map<string,Vehicle>(); readonly customers=new Map<string,Customer>();
 readonly listings=new Map<string,Listing>(); readonly reservations=new Map<string,Reservation>();
 readonly purchases=new Map<string,PurchaseRequest>();
 snapshot(){return {vehicles:this.vehicles.size,customers:this.customers.size,listings:this.listings.size,reservations:this.reservations.size,purchaseRequests:this.purchases.size};}
}
