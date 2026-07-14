import { Body, Controller, Get, Post } from "@nestjs/common";
import { EnterpriseAnomalyDetectionService } from "./enterprise-anomaly-detection.service";
import { EnterpriseAutoRemediationService } from "./enterprise-auto-remediation.service";
import { EnterpriseAutonomousOperationsService } from "./enterprise-autonomous-operations.service";
import { EnterpriseE6OrchestratorService } from "./enterprise-e6-orchestrator.service";
import { EnterpriseFailoverCoordinatorService } from "./enterprise-failover-coordinator.service";
import { EnterpriseRemediationPlannerService } from "./enterprise-remediation-planner.service";
import { EnterpriseResilienceAutomationService } from "./enterprise-resilience-automation.service";
import { EnterpriseAnomalySeverity } from "./enterprise-e6.types";

@Controller("enterprise-e6")
export class EnterpriseE6Controller {
  constructor(
    private readonly orchestrator: EnterpriseE6OrchestratorService,
    private readonly anomalies: EnterpriseAnomalyDetectionService,
    private readonly remediation: EnterpriseRemediationPlannerService,
    private readonly autoRemediation: EnterpriseAutoRemediationService,
    private readonly autonomousOperations: EnterpriseAutonomousOperationsService,
    private readonly resilience: EnterpriseResilienceAutomationService,
    private readonly failover: EnterpriseFailoverCoordinatorService,
  ) {}

  @Get("status")
  status() {
    return this.orchestrator.status();
  }

  @Post("bootstrap")
  bootstrap() {
    return this.orchestrator.bootstrap();
  }

  @Get("anomalies")
  listAnomalies() {
    return this.anomalies.list();
  }

  @Get("remediations")
  listRemediations() {
    return this.remediation.list();
  }

  @Post("remediate")
  remediate(
    @Body()
    body: {
      source?: string;
      code?: string;
      severity?: EnterpriseAnomalySeverity;
      details?: Record<string, unknown>;
    },
  ) {
    return this.autoRemediation.remediate(body || {});
  }

  @Post("operations/run")
  runOperation(
    @Body()
    body: {
      source?: string;
      code?: string;
      severity?: EnterpriseAnomalySeverity;
      details?: Record<string, unknown>;
    },
  ) {
    return this.autonomousOperations.execute(body || {});
  }

  @Get("recovery")
  recoverySnapshot() {
    return this.resilience.snapshot();
  }

  @Get("failover")
  failoverSnapshot() {
    return this.failover.failover();
  }

  @Post("smoke")
  smoke() {
    const result = this.orchestrator.run();

    return {
      success: result.success,
      system: "AVOS Enterprise Mega Bundle E6",
      integrationStatus: "running",
      operationStatus: result.status,
      anomalyDetected: Boolean(result.anomaly),
      remediationStatus: result.remediation?.status || "UNKNOWN",
      autonomousOperations: result.recovery.autonomousOperations,
      selfHealingReadiness: result.recovery.selfHealingReadiness,
      capabilities: 6,
    };
  }
}