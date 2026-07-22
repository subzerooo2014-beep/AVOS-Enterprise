import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { MobilityStoreService } from './mobility-store.service';
import { Vehicle,Customer,Listing,Reservation,PurchaseRequest } from './types';
import { CreateVehicleDto,CreateCustomerDto,CreateListingDto,CreateReservationDto,CreatePurchaseRequestDto,PricingDto,RecommendationDto } from './dto';
import { mobilityId } from './id.factory';
import { ExecutionAdapter } from './adapters/execution.adapter';
import { KnowledgeAdapter } from './adapters/knowledge.adapter';
import { IntelligenceAdapter } from './adapters/intelligence.adapter';
import { IdentityAdapter } from './adapters/identity.adapter';
import { SearchAdapter } from './adapters/search.adapter';
import { AuditAdapter } from './adapters/audit.adapter';

@Injectable()
export class MobilityService {
 constructor(private readonly store:MobilityStoreService,private readonly execution:ExecutionAdapter,private readonly knowledge:KnowledgeAdapter,private readonly intelligence:IntelligenceAdapter,private readonly identity:IdentityAdapter,private readonly search:SearchAdapter,private readonly audit:AuditAdapter){}
 private text(v:unknown,n:string){if(typeof v!=='string'||!v.trim())throw new BadRequestException(`${n} is required.`);return v.trim();}
 private num(v:unknown,n:string){const x=Number(v);if(!Number.isFinite(x)||x<0)throw new BadRequestException(`${n} must be non-negative.`);return x;}
 vehicle(id:string){const x=this.store.vehicles.get(id);if(!x)throw new NotFoundException(`Vehicle ${id} not found.`);return x;}
 customer(id:string){const x=this.store.customers.get(id);if(!x)throw new NotFoundException(`Customer ${id} not found.`);return x;}
 createVehicle(d:CreateVehicleDto){const x:Vehicle={id:mobilityId('vehicle'),make:this.text(d.make,'make'),model:this.text(d.model,'model'),year:this.num(d.year,'year'),mileage:this.num(d.mileage,'mileage'),askingPrice:this.num(d.askingPrice,'askingPrice'),currency:d.currency?.trim()||'AED',status:'active',createdAt:new Date().toISOString()};this.knowledge.execute('validate-vehicle',x);this.intelligence.execute('enrich-vehicle',x);this.audit.execute('vehicle-created',x);this.store.vehicles.set(x.id,x);return x;}
 createCustomer(d:CreateCustomerDto){const x:Customer={id:mobilityId('customer'),name:this.text(d.name,'name'),email:d.email?.trim(),phone:d.phone?.trim(),createdAt:new Date().toISOString()};this.identity.execute('register-customer',x);this.store.customers.set(x.id,x);return x;}
 createListing(d:CreateListingDto){const v=this.vehicle(d.vehicleId);const x:Listing={id:mobilityId('listing'),vehicleId:v.id,title:d.title?.trim()||`${v.year} ${v.make} ${v.model}`,price:Number(d.price??v.askingPrice),currency:d.currency?.trim()||v.currency,status:'published',createdAt:new Date().toISOString()};this.search.execute('index-listing',x);this.store.listings.set(x.id,x);return x;}
 createReservation(d:CreateReservationDto){const v=this.vehicle(d.vehicleId);const c=this.customer(d.customerId);const duplicate=[...this.store.reservations.values()].some(r=>r.vehicleId===v.id&&r.status==='confirmed');if(duplicate)throw new ConflictException('Vehicle already reserved.');const x:Reservation={id:mobilityId('reservation'),vehicleId:v.id,customerId:c.id,status:'confirmed',expiresAt:new Date(Date.now()+Number(d.expiresInMinutes??60)*60000).toISOString(),createdAt:new Date().toISOString()};v.status='reserved';this.store.vehicles.set(v.id,v);this.store.reservations.set(x.id,x);this.execution.execute('reservation-workflow',x);return x;}
 createPurchase(d:CreatePurchaseRequestDto){const v=this.vehicle(d.vehicleId);const c=this.customer(d.customerId);const offered=this.num(d.offeredPrice,'offeredPrice');const requires=Math.abs(offered-v.askingPrice)>v.askingPrice*.05;const x:PurchaseRequest={id:mobilityId('purchase'),vehicleId:v.id,customerId:c.id,offeredPrice:offered,currency:d.currency?.trim()||v.currency,status:requires?'pending':'approved',requiresHumanApproval:requires,createdAt:new Date().toISOString()};this.store.purchases.set(x.id,x);this.execution.execute('purchase-workflow',x);return x;}
 pricing(d:PricingDto){const v=this.vehicle(d.vehicleId);const age=Math.max(0,new Date().getFullYear()-v.year);const suggested=Math.round(v.askingPrice*Math.max(.55,1-age*.035-v.mileage/1000000));const result={vehicleId:v.id,askingPrice:v.askingPrice,suggestedPrice:suggested,currency:v.currency,confidence:.78,requiresHumanApproval:Math.abs(v.askingPrice-suggested)>v.askingPrice*.15,explanation:[`Age ${age}`,`Mileage ${v.mileage}`],analyzedAt:new Date().toISOString()};this.intelligence.execute('pricing-analysis',result);return result;}
 recommend(d:RecommendationDto){const xs=[...this.store.vehicles.values()].filter(v=>v.status==='active').filter(v=>!d.budget||v.askingPrice<=d.budget).filter(v=>!d.make||v.make.toLowerCase()===d.make.toLowerCase()).sort((a,b)=>a.askingPrice-b.askingPrice);return {count:xs.length,recommendations:xs.slice(0,10),generatedAt:new Date().toISOString()};}
 all(){return {vehicles:[...this.store.vehicles.values()],customers:[...this.store.customers.values()],listings:[...this.store.listings.values()],reservations:[...this.store.reservations.values()],purchaseRequests:[...this.store.purchases.values()]};}
}
