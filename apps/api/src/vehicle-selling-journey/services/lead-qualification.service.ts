import { Injectable } from "@nestjs/common";
@Injectable()
export class LeadQualificationService {
  qualify(input: { budget: number; askingPrice: number; trustScore: number }) {
    const score = Math.round((input.budget >= input.askingPrice ? 50 : 20) + input.trustScore * 0.5);
    return { score, decision: score >= 70 ? "QUALIFIED" : score >= 45 ? "REVIEW" : "REJECT" };
  }
}
