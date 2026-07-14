import { Injectable } from "@nestjs/common";
import { RecallPolicy } from "../policies/recall.policy";
@Injectable()
export class RecallService {
  private readonly records:Array<Record<string,unknown>>=[];
  constructor(private readonly policy:RecallPolicy){}
  create(input:{vehicleId:string;campaignCode:string;description:string;severity:string}){this.policy.validate(input.campaignCode,input.severity);const r={id:`recall_${Date.now()}`,...input,status:"OPEN"};this.records.push(r);return r;}
  list(){return [...this.records];}
}
