import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { EnterpriseE4OrchestratorService } from "./enterprise-e4-orchestrator.service";
import { EnterpriseGovernanceControlService } from "./enterprise-governance-control.service";
import { EnterpriseIncidentCommandService } from "./enterprise-incident-command.service";
import { EnterpriseOperationalIntelligenceService } from "./enterprise-operational-intelligence.service";
import { EnterpriseReliabilityIntelligenceService } from "./enterprise-reliability-intelligence.service";
import { EnterpriseIncidentSeverity } from "./enterprise-e4.types";

@Controller("enterprise-e4")
export class EnterpriseE4Controller {
  constructor(
    private readonly orchestrator: EnterpriseE4OrchestratorService,
    private readonly governance: EnterpriseGovernanceControlService,
    private readonly incidents: EnterpriseIncidentCommandService,
    private readonly reliability: EnterpriseReliabilityIntelligenceService,
    private readonly intelligence: EnterpriseOperationalIntelligenceService,
  ) {}

  @Get("status")
  status() {
    return this.orchestrator.status();
  }

  @Get("governance")
  governanceSnapshot() {
    return this.governance.snapshot();
  }

  @Get("reliability")
  reliabilitySnapshot() {
    return this.reliability.snapshot();
  }

  @Get("intelligence")
  operationalIntelligence() {
    return this.intelligence.analyze();
  }

  @Get("incidents")
  listIncidents() {
    return this.incidents.list();
  }

  @Post("incidents")
  createIncident(
    @Body()
    body: {
      title?: string;
      source?: string;
      severity?: EnterpriseIncidentSeverity;
      metadata?: Record<string, unknown>;
    },
  ) {
    return this.incidents.create(body || {});
  }

  @Patch("incidents/:id/acknowledge")
  acknowledgeIncident(@Param("id") id: string) {
    return this.incidents.acknowledge(id);
  }

  @Patch("incidents/:id/resolve")
  resolveIncident(@Param("id") id: string) {
    return this.incidents.resolve(id);
  }

  @Post("operations/run")
  runOperation(@Body() body: Record<string, unknown>) {
    return this.orchestrator.run(body || {});
  }

  @Post("smoke")
  smoke() {
    const operation = this.orchestrator.run({
      source: "enterprise-e4-smoke",
    });

    return {
      success: operation.status === "COMPLETED",
      system: "AVOS Enterprise Mega Bundle E4",
      operationStatus: operation.status,
      governanceAllowed: operation.governance.allowed,
      availability: operation.reliability.availability,
      errorBudgetRemaining: operation.reliability.errorBudgetRemaining,
      recoveryReadiness: operation.reliability.recoveryReadiness,
      capabilities: 4,
    };
  }
}