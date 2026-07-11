import { Injectable } from "@nestjs/common";

@Injectable()
export class DecisionEngineService {
  evaluate(input:any){
    const score=(input.score??50);
    return {
      score,
      decision:
        score>=85?"AUTO_APPROVE":
        score>=65?"MANUAL_REVIEW":
        "REJECT",
      confidence: Math.min(99,score),
    };
  }
}
