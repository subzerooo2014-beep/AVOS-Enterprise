import { Injectable } from "@nestjs/common";
@Injectable()
export class SafetyPolicy {
  evaluate(input: { harshBrakingCount: number; rapidAccelerationCount: number; speedingEvents: number }) {
    const penalty =
      input.harshBrakingCount * 2 +
      input.rapidAccelerationCount * 2 +
      input.speedingEvents * 4;
    const score = Math.max(0, 100 - penalty);
    return { score, status: score >= 80 ? "SAFE" : score >= 60 ? "REVIEW" : "HIGH_RISK" };
  }
}
