import { Injectable } from "@nestjs/common";
import { WarrantyPolicy } from "../policies/warranty.policy";
@Injectable()
export class WarrantyService {
  private readonly records:Array<Record<string,unknown>>=[];
  constructor(private readonly policy:WarrantyPolicy){}
  create(input:{lifecycleId:string;provider:string;startsAt:string;endsAt:string;coverage:string[]}){this.policy.validate(input.startsAt,input.endsAt);const r={id:`warranty_${Date.now()}`,...input,status:"ACTIVE"};this.records.push(r);return r;}
  list(){return [...this.records];}
}
