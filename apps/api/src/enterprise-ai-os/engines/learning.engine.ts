import { Injectable } from "@nestjs/common";
@Injectable()
export class LearningEngine {
  learn(input: { score: number; accepted: boolean }) {
    const adjustment = input.accepted ? input.score * 0.01 : -input.score * 0.005;
    return {
      adjustment: Math.round(adjustment * 1000) / 1000,
      accepted: input.accepted,
    };
  }
}
