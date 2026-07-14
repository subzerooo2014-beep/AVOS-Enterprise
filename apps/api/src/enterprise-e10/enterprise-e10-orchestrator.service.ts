import { Injectable } from "@nestjs/common";
import { EnterpriseValueActionService } from "./enterprise-value-action.service";
import { EnterpriseValueLeakageService } from "./enterprise-value-leakage.service";
import { EnterpriseValueOpportunityService } from "./enterprise-value-opportunity.service";
import { EnterpriseValueOrchestratorService } from "./enterprise-value-orchestrator.service";
import { EnterpriseValueOutcomeService } from "./enterprise-value-outcome.service";

@Injectable()
export class EnterpriseE10OrchestratorService {
  constructor(
    private readonly opportunities: EnterpriseValueOpportunityService,
    private readonly outcomes: EnterpriseValueOutcomeService,
    private readonly actions: EnterpriseValueActionService,
    private readonly leakage: EnterpriseValueLeakageService,
    private readonly valueOrchestrator: EnterpriseValueOrchestratorService,
  ) {}

  bootstrap() {
    if (this.opportunities.count() === 0) {
      const opportunity = this.opportunities.create({
        name: "AVOS foundational value opportunity",
        domain: "platform-foundation",
        expectedValue: 75000,
        confidence: 90,
        timeToValueDays: 20,
        riskScore: 15,
      });

      this.outcomes.measure(opportunity.id, 70000);
    }

    return this.status();
  }

  run() {
    this.bootstrap();
    return this.valueOrchestrator.run();
  }

  snapshot() {
    const totalExpectedValue = this.opportunities.totalExpectedValue();
    const totalMeasuredValue = this.outcomes.totalMeasuredValue();
    const valueRealizationScore =
      totalExpectedValue <= 0
        ? 0
        : Math.min(
            100,
            Math.round((totalMeasuredValue / totalExpectedValue) * 100),
          );

    return {
      opportunities: this.opportunities.count(),
      outcomes: this.outcomes.count(),
      actions: this.actions.count(),
      executedActions: this.actions.executedCount(),
      atRiskOpportunities: this.opportunities.atRiskCount(),
      totalExpectedValue,
      totalMeasuredValue,
      valueRealizationScore,
      leakage: this.leakage.analyze(),
      generatedAt: new Date().toISOString(),
    };
  }

  status() {
    return {
      success: true,
      system: "AVOS Enterprise Mega Bundle E10",
      integrationStatus: "running",
      valueOpportunityDiscovery: true,
      benefitTracking: true,
      outcomeMeasurement: true,
      valueLeakageDetection: true,
      valueActionExecution: true,
      valueGovernance: true,
      valueRealization: true,
      snapshot: this.snapshot(),
      capabilities: 7,
    };
  }
}