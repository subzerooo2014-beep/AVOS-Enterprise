import { Controller, Get, Param } from "@nestjs/common";
import { AiDecisionService } from "./ai-decision.service";

@Controller("ai-decision")
export class AiDecisionController {
  constructor(
    private readonly service: AiDecisionService,
  ) {}

  @Get("vehicle/:id")
  evaluate(@Param("id") id: string) {
    return this.service.evaluateVehicle(id);
  }
}
