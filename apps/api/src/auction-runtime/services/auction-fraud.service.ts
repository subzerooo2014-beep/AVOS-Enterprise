import { Injectable } from "@nestjs/common";
import { AntiManipulationPolicy } from "../policies/anti-manipulation.policy";
@Injectable()
export class AuctionFraudService {
  constructor(private readonly policy: AntiManipulationPolicy) {}
  evaluate(input: { bidderId: string; sellerId: string; repeatedPatternCount: number }) {
    return this.policy.evaluate(input);
  }
}
