import { Controller, Get } from "@nestjs/common";
import { FinalAcceptanceService } from "./final-acceptance.service";

@Controller("production-certification/final-acceptance")
export class FinalAcceptanceController {
  constructor(private readonly acceptance: FinalAcceptanceService) {}

  @Get("status")
  status() {
    return this.acceptance.snapshot();
  }
}