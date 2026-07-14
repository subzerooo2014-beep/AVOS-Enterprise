import { Injectable } from "@nestjs/common";
import { PartsPolicy } from "../policies/parts.policy";
@Injectable()
export class PartsInventoryService {
  private readonly records:Array<Record<string,unknown>>=[];
  constructor(private readonly policy:PartsPolicy){}
  create(input:{sku:string;name:string;stock:number;unitCost:number}){this.policy.validate(input.stock,input.unitCost);const r={id:`part_${Date.now()}`,...input};this.records.push(r);return r;}
  list(){return [...this.records];}
}
