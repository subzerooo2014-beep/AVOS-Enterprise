import { Body, Controller, Get, Post } from "@nestjs/common";

import { EnterpriseDecisionService } from "./enterprise-decision.service";

@Controller("enterprise-decision")
export class EnterpriseDecisionController {
  constructor(
    private readonly decisionService: EnterpriseDecisionService,
  ) {}

  @Get("status")
  status() {
    return this.decisionService.status();
  }

  @Post("process")
  process(@Body() body: Record<string, any>) {
    return this.decisionService.process(body);
  }
}
