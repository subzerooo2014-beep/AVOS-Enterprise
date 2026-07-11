import { Body, Controller, Get, Post } from "@nestjs/common";
import { RiskEngineService } from "./risk-engine.service";

@Controller("risk-engine")
export class RiskEngineController {
  constructor(private service: RiskEngineService) {}

  @Post("assess")
  assess(@Body() body: any) {
    return this.service.assess(body.entityType, body.entityId, body.factors || {});
  }

  @Get()
  list() {
    return this.service.list();
  }
}
