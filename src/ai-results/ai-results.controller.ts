import { Controller, Get, Param } from "@nestjs/common";
import { AiResultsService } from "./ai-results.service";

@Controller("ai-results")
export class AiResultsController {
  constructor(private readonly service: AiResultsService) {}

  @Get("vehicle/:id")
  getVehicleResults(@Param("id") id: string) {
    return this.service.getVehicleResults(id);
  }
}
