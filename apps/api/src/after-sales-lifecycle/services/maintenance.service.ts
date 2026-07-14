import { Injectable } from "@nestjs/common";
import { MaintenancePolicy } from "../policies/maintenance.policy";
@Injectable()
export class MaintenanceService {
  private readonly records:Array<Record<string,unknown>>=[];
  constructor(private readonly policy:MaintenancePolicy){}
  schedule(input:{lifecycleId:string;serviceType:string;scheduledAt:string;workshopId:string}){this.policy.validate(input.scheduledAt);const r={id:`maintenance_${Date.now()}`,...input,status:"SCHEDULED"};this.records.push(r);return r;}
  complete(id:string,input:Record<string,unknown>){const r=this.records.find(x=>x.id===id);if(!r)throw new Error("Maintenance not found");Object.assign(r,input,{status:"COMPLETED"});return r;}
  list(){return [...this.records];}
}
