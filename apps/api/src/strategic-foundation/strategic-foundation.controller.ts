import { Body, Controller, Get, Post } from "@nestjs/common";
import { StrategicFoundationService } from "./strategic-foundation.service";
import {
  FutureDevelopmentProposal,
  StrategicAuditRecord,
} from "./strategic-foundation.types";

@Controller("strategic-foundation")
export class StrategicFoundationController {
  constructor(
    private readonly strategic: StrategicFoundationService,
  ) {}

  @Get("registry")
  registry() {
    return this.strategic.registry();
  }

  @Post("proposals/evaluate")
  evaluateProposal(@Body() proposal: FutureDevelopmentProposal) {
    return this.strategic.evaluateProposal(proposal);
  }

  @Post("executive-briefs")
  executiveBrief(
    @Body() body: { tenantId: string; objective: string },
  ) {
    return this.strategic.executiveBrief(
      body.tenantId,
      body.objective,
    );
  }

  @Post("audit")
  trackAudit(
    @Body()
    input: Omit<StrategicAuditRecord, "id" | "createdAt">,
  ) {
    return this.strategic.trackAudit(input);
  }

  @Get("dashboard")
  dashboard() {
    return this.strategic.dashboard();
  }
}