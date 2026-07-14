import { Injectable } from "@nestjs/common";
@Injectable()
export class AntiManipulationPolicy {
  evaluate(input: { bidderId: string; sellerId: string; repeatedPatternCount: number }) {
    const suspicious = input.bidderId === input.sellerId || input.repeatedPatternCount >= 5;
    return { suspicious, decision: suspicious ? "REVIEW" : "ALLOW" };
  }
}
