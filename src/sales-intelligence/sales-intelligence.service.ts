import { Injectable } from "@nestjs/common";
import { DealScoreDto } from "./dto/deal-score.dto";

@Injectable()
export class SalesIntelligenceService {
  scoreDeal(dto: DealScoreDto) {
    const price = dto.vehiclePrice || 0;
    const offer = dto.offeredPrice || 0;
    const discount = price > 0 ? ((price - offer) / price) * 100 : 0;

    let score = 60;

    if (dto.paymentType?.toLowerCase() === "cash") score += 15;
    if (discount <= 5) score += 15;
    if (discount > 15) score -= 25;

    return {
      score: Math.max(0, Math.min(100, Math.round(score))),
      discountPercent: Math.round(discount),
      recommendation:
        score >= 80 ? "APPROVE_FAST" :
        score >= 60 ? "NEGOTIATE" :
        "REVIEW_MANUALLY",
    };
  }
}
