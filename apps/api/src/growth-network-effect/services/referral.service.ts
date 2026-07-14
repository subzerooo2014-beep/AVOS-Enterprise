import { Injectable } from "@nestjs/common";
import { ReferralPolicy } from "../policies/referral.policy";
import { growthId } from "../growth-network-effect.utils";
@Injectable()
export class ReferralService {
  private readonly records:Array<Record<string,unknown>>=[];
  constructor(private readonly policy:ReferralPolicy){}
  create(input:any){const reward=input.rewardAmount??50;this.policy.validate(input.referrerId,input.referredUserId,reward);const r={id:growthId("referral"),...input,rewardAmount:reward,code:`REF${Date.now()}`,status:"PENDING",createdAt:new Date().toISOString()};this.records.push(r);return r;}
  list(){return [...this.records];}
}
