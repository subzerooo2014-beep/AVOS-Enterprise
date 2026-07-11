import { Injectable } from "@nestjs/common";
import { LeadScoreDto } from "./dto/lead-score.dto";

@Injectable()
export class CrmIntelligenceService {
  scoreLead(dto: LeadScoreDto) {
    let score = 40;

    if (dto.phone) score += 20;
    if (dto.source?.toLowerCase().includes("ad")) score += 15;
    if (dto.interest?.toLowerCase().includes("buy")) score += 20;

    const level =
      score >= 80 ? "HOT" :
      score >= 60 ? "WARM" :
      "COLD";

    return {
      lead: dto,
      score: Math.min(score, 100),
      level,
      recommendation:
        level === "HOT"
          ? "Contact immediately"
          : level === "WARM"
          ? "Follow up today"
          : "Add to nurture campaign",
    };
  }
}
