import { Controller, Get } from "@nestjs/common";
import { VehicleIntelligenceFinalOrchestratorService } from "./vehicle-intelligence-final-orchestrator.service";

@Controller("vehicle-intelligence-final")
export class VehicleIntelligenceFinalController {
  constructor(
    private readonly orchestrator: VehicleIntelligenceFinalOrchestratorService,
  ) {}

  @Get("status")
  status() {
    return this.orchestrator.snapshot();
  }
}
