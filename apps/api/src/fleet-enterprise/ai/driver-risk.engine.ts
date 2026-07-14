import { Injectable } from "@nestjs/common";
@Injectable()
export class DriverRiskEngine {
  evaluate(input: { safetyScore: number; accidentCount: number; speedingEvents: number }) {
    const risk = Math.min(
      100,
      Math.round((100 - input.safetyScore) * 0.5 + input.accidentCount * 15 + input.speedingEvents * 3),
    );
    return {
      risk,
      band: risk >= 70 ? "HIGH" : risk >= 40 ? "MEDIUM" : "LOW",
    };
  }
}
