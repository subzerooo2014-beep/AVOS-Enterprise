import { Module } from "@nestjs/common";
import { AeosProductionController } from "./aeos-production.controller";
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

@Module({
  controllers: [AeosProductionController],
  providers: [
    RuntimeProtectionService,
    FailureIsolationService,
    CircuitCoordinationService,
    RetryRecoveryService,
    HealthScoringService,
    ProductionReadinessGateService,
    EnterpriseTelemetryService,
    OperationalInsightsService,
    AiIncidentDetectionService,
    PredictiveFailureAnalysisService,
    CapacityForecastingService,
    SlaIntelligenceService,
    CrossServiceCoordinationService,
    AutonomousRecoveryService,
    IntelligentWorkloadDistributionService,
    DynamicPriorityManagementService,
    UnifiedOperationalTimelineService,
    EnterpriseOperationsCenterService,
    AeosProductionVerificationService,
    OperationalHealthCertificationService,
  ],
  exports: [
    EnterpriseOperationsCenterService,
    AeosProductionVerificationService,
    OperationalHealthCertificationService,
  ],
})
export class AeosProductionModule {}