import { Injectable } from "@nestjs/common";

@Injectable()
export class TradeInIntelligenceService {
  evaluate(input: {
    currentValue: number;
    conditionScore: number;
    demandScore: number;
    depreciationScore: number;
  }) {
    const adjustedValue = Math.round(
      input.currentValue *
        (0.5 + input.conditionScore / 200) *
        (0.7 + input.demandScore / 300) *
        (0.8 + input.depreciationScore / 500),
    );

    return {
      adjustedValue,
      eligible: input.conditionScore >= 50,
    };
  }
}
