import { Body, Controller, Get, Post } from "@nestjs/common";
import { EnterpriseAutonomousDecisionService } from "./enterprise-autonomous-decision.service";
import { EnterpriseE8OrchestratorService } from "./enterprise-e8-orchestrator.service";
import { EnterpriseScenarioSimulatorService } from "./enterprise-scenario-simulator.service";
import { EnterpriseSignalDetectionService } from "./enterprise-signal-detection.service";

@Controller("enterprise-e8")
export class EnterpriseE8Controller {
  constructor(
    private readonly orchestrator: EnterpriseE8OrchestratorService,
    private readonly signals: EnterpriseSignalDetectionService,
    private readonly scenarios: EnterpriseScenarioSimulatorService,
    private readonly decisions: EnterpriseAutonomousDecisionService,
  ) {}

  @Get("status")
  status() {
    return this.orchestrator.status();
  }

  @Post("bootstrap")
  bootstrap() {
    return this.orchestrator.bootstrap();
  }

  @Post("signals")
  detectSignal(
    @Body()
    body: {
      domain?: string;
      metric?: string;
      value?: number;
      threshold?: number;
    },
  ) {
    return this.signals.detect(body || {});
  }

  @Get("signals")
  listSignals() {
    return this.signals.list();
  }

  @Post("scenarios")
  simulateScenario(@Body() body: { name?: string }) {
    return this.scenarios.simulate(body?.name || "Enterprise scenario");
  }

  @Get("scenarios")
  listScenarios() {
    return this.scenarios.list();
  }

  @Get("decisions")
  listDecisions() {
    return this.decisions.list();
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
      system: "AVOS Enterprise Mega Bundle E8",
      integrationStatus: "running",
      decisionStatus: result.status,
      policyAllowed: result.governance.policyAllowed,
      decisionAction: result.decision.action,
      decisionConfidence: result.decision.confidence,
      resilienceScore: snapshot.resilienceScore,
      decisionReadiness: snapshot.decisionReadiness,
      executedDecisions: snapshot.executedDecisions,
      capabilities: 7,
    };
  }
}