import { Body, Controller, Post } from "@nestjs/common";
import { CrmIntelligenceService } from "./crm-intelligence.service";
import { LeadScoreDto } from "./dto/lead-score.dto";

@Controller("crm-intelligence")
export class CrmIntelligenceController {
  constructor(private service: CrmIntelligenceService) {}

  @Post("lead-score")
  scoreLead(@Body() dto: LeadScoreDto) {
    return this.service.scoreLead(dto);
  }
}
