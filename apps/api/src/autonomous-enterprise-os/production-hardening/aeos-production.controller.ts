import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import {
  RecoveryRequestDto,
  RuntimeSignalDto,
  WorkloadRequestDto,
} from "./dto/aeos-production.dto";
import { RuntimeProtectionService } from "./runtime-protection.service";
import { FailureIsolationService } from "./failure-isolation.service";
import { CircuitCoordinationService } from "./circuit-coordination.service";
import { RetryRecoveryService } from "./retry-recovery.service";
import { HealthScoringService } from "./health-scoring.service";
import { ProductionReadinessGateService } from "./production-readiness-gate.service";
import { EnterpriseTelemetryService } from "./enterprise-telemetry.service";
import { OperationalInsightsService } from "./operational-insights.service";
import { AiIncidentDetectionService } from "./ai-incident-detection.service";
import { PredictiveFailureAnalysisService } from "./predictive-failure-analysis.service";
import { CapacityForecastingService } from "./capacity-forecasting.service";
import { SlaIntelligenceService } from "./sla-intelligence.service";
import { CrossServiceCoordinationService } from "./cross-service-coordination.service";
import { AutonomousRecoveryService } from "./autonomous-recovery.service";
import { IntelligentWorkloadDistributionService } from "./intelligent-workload-distribution.service";
import { DynamicPriorityManagementService } from "./dynamic-priority-management.service";
import { UnifiedOperationalTimelineService } from "./unified-operational-timeline.service";
import { EnterpriseOperationsCenterService } from "./enterprise-operations-center.service";
import { AeosProductionVerificationService } from "./aeos-production-verification.service";
import { OperationalHealthCertificationService } from "./operational-health-certification.service";

@Controller("avos/aeos/production")
export class AeosProductionController {
  constructor(
    private readonly runtimeProtection: RuntimeProtectionService,
    private readonly isolation: FailureIsolationService,
    private readonly circuits: CircuitCoordinationService,
    private readonly retryRecovery: RetryRecoveryService,
    private readonly healthScoring: HealthScoringService,
    private readonly readiness: ProductionReadinessGateService,
    private readonly telemetry: EnterpriseTelemetryService,
    private readonly insights: OperationalInsightsService,
    private readonly incidents: AiIncidentDetectionService,
    private readonly predictiveFailure: PredictiveFailureAnalysisService,
    private readonly capacity: CapacityForecastingService,
    private readonly sla: SlaIntelligenceService,
    private readonly coordination: CrossServiceCoordinationService,
    private readonly recovery: AutonomousRecoveryService,
    private readonly workload: IntelligentWorkloadDistributionService,
    private readonly priority: DynamicPriorityManagementService,
    private readonly timeline: UnifiedOperationalTimelineService,
    private readonly operationsCenter: EnterpriseOperationsCenterService,
    private readonly verification: AeosProductionVerificationService,
    private readonly certification: OperationalHealthCertificationService,
  ) {}

  @Get("status")
  status() {
    return this.operationsCenter.status();
  }

  @Get("dashboard")
  dashboard() {
    return this.operationsCenter.dashboard();
  }

  @Get("executive")
  executiveOperations() {
    return this.operationsCenter.status();
  }

  @Get("timeline")
  timelineStatus(@Query("limit") limit?: string) {
    return this.timeline.recent(Number(limit ?? 100));
  }

  @Post("telemetry")
  captureTelemetry(@Body() signal: RuntimeSignalDto) {
    const captured = this.telemetry.capture(signal);
    const protection = this.runtimeProtection.evaluate(signal);
    const health = this.healthScoring.calculate(signal);
    const incidents = this.incidents.detect(signal);
    this.timeline.record("telemetry", {
      unit: signal.unit,
      healthScore: health.score,
      incidents: incidents.length,
    });
    return { captured, protection, health, incidents };
  }

  @Get("insights")
  operationalInsights() {
    return this.insights.generate();
  }

  @Post("predictive-failure")
  predictiveFailureAnalysis(@Body() signals: RuntimeSignalDto[]) {
    return this.predictiveFailure.analyze(signals);
  }

  @Post("capacity-forecast")
  capacityForecast(@Body() signals: RuntimeSignalDto[]) {
    return this.capacity.forecast(signals);
  }

  @Post("sla")
  slaIntelligence(@Body() signal: RuntimeSignalDto) {
    return this.sla.evaluate(signal);
  }

  @Post("isolate")
  isolate(@Body() input: { unit: string; reason: string }) {
    return this.isolation.isolate(input.unit, input.reason);
  }

  @Post("circuit")
  circuit(
    @Body()
    input: { unit: string; state: "closed" | "open" | "half-open" },
  ) {
    return this.circuits.transition(input.unit, input.state);
  }

  @Get("circuits")
  circuitStatus() {
    return this.circuits.status();
  }

  @Post("retry-plan")
  retryPlan(@Body() input: { unit: string; attempt?: number }) {
    return this.retryRecovery.plan(input.unit, input.attempt);
  }

  @Post("readiness")
  productionReadiness(@Body() checks: Record<string, boolean>) {
    return this.readiness.evaluate(checks);
  }

  @Post("coordinate")
  crossServiceCoordination(
    @Body() input: { units: string[]; objective: string },
  ) {
    return this.coordination.coordinate(input.units, input.objective);
  }

  @Post("recovery")
  autonomousRecovery(@Body() request: RecoveryRequestDto) {
    return this.recovery.execute(request);
  }

  @Post("workload")
  distributeWorkload(@Body() request: WorkloadRequestDto) {
    return this.workload.distribute(request);
  }

  @Post("priority")
  dynamicPriority(
    @Body()
    input: {
      businessImpact?: number;
      urgency?: number;
      risk?: number;
      complianceCritical?: boolean;
    },
  ) {
    return this.priority.calculate(input);
  }

  @Post("verification/run")
  runVerification() {
    return this.verification.run();
  }

  @Post("certification/certify")
  certify(@Body() body?: { approvedBy?: string }) {
    return this.certification.certify(body?.approvedBy);
  }
}