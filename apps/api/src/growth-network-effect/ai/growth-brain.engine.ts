import { Injectable } from "@nestjs/common";
@Injectable()
export class GrowthBrainEngine {
  evaluate(input:{acquisition:number;activation:number;retention:number;revenue:number;referral:number}){
    const score=Math.round(input.acquisition*.2+input.activation*.2+input.retention*.25+input.revenue*.2+input.referral*.15);
    return {score,priority:score<50?"RECOVERY":score<75?"OPTIMIZE":"SCALE"};
  }
}
