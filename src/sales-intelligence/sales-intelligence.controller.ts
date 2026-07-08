import { Body, Controller, Post } from "@nestjs/common";
import { SalesIntelligenceService } from "./sales-intelligence.service";
import { DealScoreDto } from "./dto/deal-score.dto";

@Controller("sales-intelligence")
export class SalesIntelligenceController {
  constructor(private service: SalesIntelligenceService) {}

  @Post("deal-score")
  scoreDeal(@Body() dto: DealScoreDto) {
    return this.service.scoreDeal(dto);
  }
}
