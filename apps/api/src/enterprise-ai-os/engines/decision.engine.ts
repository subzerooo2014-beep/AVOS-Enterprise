import { Injectable } from "@nestjs/common";
@Injectable()
export class EnterpriseDecisionEngine {
  decide(options: Array<{ id: string; score: number; risk: number }>) {
    const ranked = options
      .map((option) => ({
        ...option,
        finalScore: option.score - option.risk * 0.5,
      }))
      .sort((a, b) => b.finalScore - a.finalScore);
    return {
      selected: ranked.length ? ranked[0] : undefined,
      ranked,
    };
  }
}
