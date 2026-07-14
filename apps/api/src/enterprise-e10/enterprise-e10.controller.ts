import { Body, Controller, Get, Post } from "@nestjs/common";
import { EnterpriseE10OrchestratorService } from "./enterprise-e10-orchestrator.service";
import { EnterpriseValueOpportunityService } from "./enterprise-value-opportunity.service";
import { EnterpriseValueOutcomeService } from "./enterprise-value-outcome.service";

@Controller("enterprise-e10")
export class EnterpriseE10Controller {
  constructor(
    private readonly orchestrator: EnterpriseE10OrchestratorService,
    private readonly opportunities: EnterpriseValueOpportunityService,
    private readonly outcomes: EnterpriseValueOutcomeService,
  ) {}

  @Get("status")
  status() {
    return this.orchestrator.status();
  }

  @Post("bootstrap")
  bootstrap() {
    return this.orchestrator.bootstrap();
  }

  @Post("opportunities")
  createOpportunity(
    @Body()
    body: {
      name?: string;
      domain?: string;
      expectedValue?: number;
      confidence?: number;
      timeToValueDays?: number;
      riskScore?: number;
    },
  ) {
    return this.opportunities.create(body || {});
  }

  @Get("opportunities")
  listOpportunities() {
    return this.opportunities.list();
  }

  @Post("outcomes")
  measureOutcome(
    @Body()
    body: {
      opportunityId: string;
      measuredValue?: number;
    },
  ) {
    return this.outcomes.measure(body.opportunityId, body.measuredValue);
  }

  @Get("outcomes")
  listOutcomes() {
    return this.outcomes.list();
  }

  @Get("snapshot")
  snapshot() {
    return this.orchestrator.snapshot();
  }

  @Post("smoke")
  smoke() {
    const result = this.orchestrator.run();
    const snapshot = this.orchestrator.snapshot();

    return {
      success: result.success,
      system: "AVOS Enterprise Mega Bundle E10",
      integrationStatus: "running",
      valueStatus: result.status,
      governanceApproved: result.governance.approved,
      actionExecuted: result.action?.executed ?? false,
      realizationRate: result.outcome?.realizationRate ?? 0,
      leakageValue: result.outcome?.leakageValue ?? 0,
      valueRealizationScore: snapshot.valueRealizationScore,
      totalMeasuredValue: snapshot.totalMeasuredValue,
      capabilities: 7,
    };
  }
}