import { Injectable } from "@nestjs/common";
import { SubscriptionPolicy } from "../policies/subscription.policy";
@Injectable()
export class LifecycleSubscriptionService {
  private readonly records:Array<Record<string,unknown>>=[];
  constructor(private readonly policy:SubscriptionPolicy){}
  create(input:{lifecycleId:string;plan:string;durationMonths:number}){this.policy.validate(input.plan,input.durationMonths);const r={id:`lifecycle_subscription_${Date.now()}`,...input,status:"ACTIVE"};this.records.push(r);return r;}
  list(){return [...this.records];}
}
