import { Injectable } from "@nestjs/common";
import { clamp } from "../ultra-ai-commerce.utils";

@Injectable()
export class VehicleHealthEngine {
  calculate(input: { mileage: number; ageYears: number; conditionScore: number; serviceHistoryScore: number; accidentCount?: number }) {
    const mileagePenalty = Math.min(35, input.mileage / 6000);
    const agePenalty = Math.min(25, input.ageYears * 2);
    const accidentPenalty = Math.min(30, (input.accidentCount ?? 0) * 10);
    const score = clamp(input.conditionScore * 0.55 + input.serviceHistoryScore * 0.45 - mileagePenalty - agePenalty - accidentPenalty);
    return { healthScore: score, status: score >= 80 ? "EXCELLENT" : score >= 60 ? "GOOD" : score >= 40 ? "FAIR" : "POOR" };
  }
}
