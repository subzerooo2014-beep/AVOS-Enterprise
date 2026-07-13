import { Body, Controller, Get, Post } from "@nestjs/common";

import { EnterpriseOrchestrationService } from "./enterprise-orchestration.service";

@Controller("enterprise-orchestration")
export class EnterpriseOrchestrationController {
  constructor(
    private readonly orchestrationService: EnterpriseOrchestrationService,
  ) {}

  @Get("status")
  status() {
    return this.orchestrationService.status();
  }

  @Post("orchestrate")
  orchestrate(@Body() body: Record<string, any>) {
    return this.orchestrationService.orchestrate(body);
  }

  @Post("compensate")
  compensate(@Body() body: Record<string, any>) {
    return this.orchestrationService.compensate(body);
  }

  @Post("retry")
  retry(@Body() body: Record<string, any>) {
    return this.orchestrationService.retryWorkflow(body);
  }
}
