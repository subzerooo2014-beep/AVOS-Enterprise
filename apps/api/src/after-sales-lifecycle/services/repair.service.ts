import { Injectable } from "@nestjs/common";
import { RepairPolicy } from "../policies/repair.policy";
@Injectable()
export class RepairService {
  private readonly records:Array<Record<string,unknown>>=[];
  constructor(private readonly policy:RepairPolicy){}
  create(input:{accidentId:string;workshopId:string;estimatedCost:number}){this.policy.validate(input.estimatedCost);const r={id:`repair_${Date.now()}`,...input,status:"OPEN"};this.records.push(r);return r;}
  list(){return [...this.records];}
}
