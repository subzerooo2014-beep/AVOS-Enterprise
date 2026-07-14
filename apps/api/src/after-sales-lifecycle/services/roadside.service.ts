import { Injectable } from "@nestjs/common";
import { RoadsidePolicy } from "../policies/roadside.policy";
@Injectable()
export class RoadsideService {
  private readonly records:Array<Record<string,unknown>>=[];
  constructor(private readonly policy:RoadsidePolicy){}
  request(input:{lifecycleId:string;latitude:number;longitude:number;issueType:string}){this.policy.validate(input.issueType);const r={id:`roadside_${Date.now()}`,...input,status:"REQUESTED"};this.records.push(r);return r;}
  list(){return [...this.records];}
}
