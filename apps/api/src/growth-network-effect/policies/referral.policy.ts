import { Injectable } from "@nestjs/common";
@Injectable()
export class ReferralPolicy {
  validate(referrerId:string,referredUserId:string,rewardAmount:number){
    if(referrerId===referredUserId) throw new Error("Self referral is not allowed");
    if(rewardAmount<0) throw new Error("Invalid referral reward");
    return true;
  }
}
