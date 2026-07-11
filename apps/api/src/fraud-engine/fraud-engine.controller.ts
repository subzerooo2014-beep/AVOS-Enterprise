import { Body, Controller, Get, Post } from "@nestjs/common";
import { FraudEngineService } from "./fraud-engine.service";

@Controller("fraud-engine")
export class FraudEngineController {
  constructor(private service: FraudEngineService) {}

  @Post("signals")
  addSignal(@Body() body: any) {
    return this.service.addSignal(body);
  }

  @Post("assess")
  assess(@Body() body: any) {
    return this.service.assess(body);
  }

  @Get("assessments")
  list() {
    return this.service.listAssessments();
  }
}
