import { Controller, Get, Param } from "@nestjs/common";
import { AiDecisionHistoryService } from "./ai-decision-history.service";

@Controller("ai-decision-history")
export class AiDecisionHistoryController {
  constructor(private readonly service: AiDecisionHistoryService) {}

  @Get("vehicle/:id")
  history(@Param("id") id: string) {
    return this.service.getHistory(id);
  }
}
