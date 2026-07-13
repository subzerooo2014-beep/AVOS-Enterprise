import { Module } from "@nestjs/common";
import { EventsModule } from "../events/events.module";
import { WorkflowsController } from "./workflows.controller";
import { WorkflowsService } from "./workflows.service";
import { CoreFlowOperationsController } from "../core-application-flows/core-flow-operations.controller";
import { CoreFlowResilienceController } from "../core-application-flows/core-flow-resilience.controller";
import { CoreFlowProcessManagerController } from "../core-application-flows/core-flow-process-manager.controller";
import { CoreFlowGovernanceController } from "../core-application-flows/core-flow-governance.controller";
import { CoreFlowEnterpriseController } from "../core-application-flows/core-flow-enterprise.controller";
import { CoreFlowIntelligenceController } from "../core-application-flows/core-flow-intelligence.controller";
import { CoreFlowAuditService } from "../core-application-flows/core-flow-audit.service";
import { CoreFlowOutboxService } from "../core-application-flows/core-flow-outbox.service";
import { CoreFlowPolicyService } from "../core-application-flows/core-flow-policy.service";
import { CoreFlowSnapshotService } from "../core-application-flows/core-flow-snapshot.service";
import { CoreFlowWorkerService } from "../core-application-flows/core-flow-worker.service";
import { CoreFlowSagaService } from "../core-application-flows/core-flow-saga.service";
import { CoreFlowSchedulerService } from "../core-application-flows/core-flow-scheduler.service";
import { CoreFlowRateLimitService } from "../core-application-flows/core-flow-rate-limit.service";
import { CoreFlowCircuitBreakerService } from "../core-application-flows/core-flow-circuit-breaker.service";
import { CoreFlowObservabilityService } from "../core-application-flows/core-flow-observability.service";
import { CoreFlowRulesService } from "../core-application-flows/core-flow-rules.service";
import { CoreFlowApprovalService } from "../core-application-flows/core-flow-approval.service";
import { CoreFlowTimeoutService } from "../core-application-flows/core-flow-timeout.service";
import { CoreFlowProcessManagerService } from "../core-application-flows/core-flow-process-manager.service";
import { CoreFlowRiskService } from "../core-application-flows/core-flow-risk.service";
import { CoreFlowPolicyEngineService } from "../core-application-flows/core-flow-policy-engine.service";
import { CoreFlowComplianceService } from "../core-application-flows/core-flow-compliance.service";
import { CoreFlowEscalationService } from "../core-application-flows/core-flow-escalation.service";
import { CoreFlowGovernanceService } from "../core-application-flows/core-flow-governance.service";
import { CoreFlowTenancyService } from "../core-application-flows/core-flow-tenancy.service";
import { CoreFlowSlaService } from "../core-application-flows/core-flow-sla.service";
import { CoreFlowCostService } from "../core-application-flows/core-flow-cost.service";
import { CoreFlowLineageService } from "../core-application-flows/core-flow-lineage.service";
import { CoreFlowRetentionService } from "../core-application-flows/core-flow-retention.service";
import { CoreFlowPrivacyService } from "../core-application-flows/core-flow-privacy.service";
import { CoreFlowChaosService } from "../core-application-flows/core-flow-chaos.service";
import { CoreFlowContractService } from "../core-application-flows/core-flow-contract.service";
import { CoreFlowEnterpriseService } from "../core-application-flows/core-flow-enterprise.service";
import { CoreFlowAnomalyService } from "../core-application-flows/core-flow-anomaly.service";
import { CoreFlowRecommendationService } from "../core-application-flows/core-flow-recommendation.service";
import { CoreFlowForecastService } from "../core-application-flows/core-flow-forecast.service";
import { CoreFlowOptimizationService } from "../core-application-flows/core-flow-optimization.service";
import { CoreFlowLearningService } from "../core-application-flows/core-flow-learning.service";
import { CoreFlowIntelligenceService } from "../core-application-flows/core-flow-intelligence.service";

import { CoreFlowAutonomousOperationsController } from "../core-application-flows/core-flow-autonomous-operations.controller";

import { CoreFlowAutonomyPolicyService } from "../core-application-flows/core-flow-autonomy-policy.service";

import { CoreFlowAutonomyService } from "../core-application-flows/core-flow-autonomy.service";

import { CoreFlowExperimentService } from "../core-application-flows/core-flow-experiment.service";

import { CoreFlowBenchmarkService } from "../core-application-flows/core-flow-benchmark.service";

import { CoreFlowReleaseService } from "../core-application-flows/core-flow-release.service";

import { CoreFlowAutonomousOperationsService } from "../core-application-flows/core-flow-autonomous-operations.service";

import { CoreFlowFederationController } from "../core-application-flows/core-flow-federation.controller";

import { CoreFlowFederationService } from "../core-application-flows/core-flow-federation.service";

import { CoreFlowRouterService } from "../core-application-flows/core-flow-router.service";

import { CoreFlowSimulationService } from "../core-application-flows/core-flow-simulation.service";

import { CoreFlowDigitalTwinService } from "../core-application-flows/core-flow-digital-twin.service";

import { CoreFlowControlPlaneService } from "../core-application-flows/core-flow-control-plane.service";

import { CoreFlowFederationOperationsService } from "../core-application-flows/core-flow-federation-operations.service";

import { CoreFlowSovereigntyController } from "../core-application-flows/core-flow-sovereignty.controller";

import { CoreFlowSovereignZoneService } from "../core-application-flows/core-flow-sovereign-zone.service";

import { CoreFlowJurisdictionService } from "../core-application-flows/core-flow-jurisdiction.service";

import { CoreFlowKeyManagementService } from "../core-application-flows/core-flow-key-management.service";

import { CoreFlowContinuityService } from "../core-application-flows/core-flow-continuity.service";

import { CoreFlowSovereigntyService } from "../core-application-flows/core-flow-sovereignty.service";

import { CoreFlowStandardsController } from "../core-application-flows/core-flow-standards.controller";

import { CoreFlowStandardsRegistryService } from "../core-application-flows/core-flow-standards-registry.service";

import { CoreFlowConformanceService } from "../core-application-flows/core-flow-conformance.service";

import { CoreFlowCertificationService } from "../core-application-flows/core-flow-certification.service";

import { CoreFlowCompatibilityService } from "../core-application-flows/core-flow-compatibility.service";

import { CoreFlowStandardsGovernanceService } from "../core-application-flows/core-flow-standards-governance.service";

@Module({
  imports: [EventsModule],
  controllers: [
    CoreFlowStandardsController,
    CoreFlowSovereigntyController,
    CoreFlowFederationController,
    CoreFlowAutonomousOperationsController,
    WorkflowsController,
    CoreFlowOperationsController,
    CoreFlowResilienceController,
    CoreFlowProcessManagerController,
    CoreFlowGovernanceController,
    CoreFlowEnterpriseController,
    CoreFlowIntelligenceController,
  ],
  providers: [
    CoreFlowStandardsGovernanceService,
    CoreFlowCompatibilityService,
    CoreFlowCertificationService,
    CoreFlowConformanceService,
    CoreFlowStandardsRegistryService,
    CoreFlowSovereigntyService,
    CoreFlowContinuityService,
    CoreFlowKeyManagementService,
    CoreFlowJurisdictionService,
    CoreFlowSovereignZoneService,
    CoreFlowFederationOperationsService,
    CoreFlowControlPlaneService,
    CoreFlowDigitalTwinService,
    CoreFlowSimulationService,
    CoreFlowRouterService,
    CoreFlowFederationService,
    CoreFlowAutonomousOperationsService,
    CoreFlowReleaseService,
    CoreFlowBenchmarkService,
    CoreFlowExperimentService,
    CoreFlowAutonomyService,
    CoreFlowAutonomyPolicyService,
    WorkflowsService,
    CoreFlowAuditService,
    CoreFlowOutboxService,
    CoreFlowPolicyService,
    CoreFlowSnapshotService,
    CoreFlowWorkerService,
    CoreFlowSagaService,
    CoreFlowSchedulerService,
    CoreFlowRateLimitService,
    CoreFlowCircuitBreakerService,
    CoreFlowObservabilityService,
    CoreFlowRulesService,
    CoreFlowApprovalService,
    CoreFlowTimeoutService,
    CoreFlowProcessManagerService,
    CoreFlowRiskService,
    CoreFlowPolicyEngineService,
    CoreFlowComplianceService,
    CoreFlowEscalationService,
    CoreFlowGovernanceService,
    CoreFlowTenancyService,
    CoreFlowSlaService,
    CoreFlowCostService,
    CoreFlowLineageService,
    CoreFlowRetentionService,
    CoreFlowPrivacyService,
    CoreFlowChaosService,
    CoreFlowContractService,
    CoreFlowEnterpriseService,
    CoreFlowAnomalyService,
    CoreFlowRecommendationService,
    CoreFlowForecastService,
    CoreFlowOptimizationService,
    CoreFlowLearningService,
    CoreFlowIntelligenceService,
  ],
  exports: [
    CoreFlowStandardsGovernanceService,
    CoreFlowCompatibilityService,
    CoreFlowCertificationService,
    CoreFlowConformanceService,
    CoreFlowStandardsRegistryService,
    CoreFlowSovereigntyService,
    CoreFlowContinuityService,
    CoreFlowKeyManagementService,
    CoreFlowJurisdictionService,
    CoreFlowSovereignZoneService,
    CoreFlowFederationOperationsService,
    CoreFlowControlPlaneService,
    CoreFlowDigitalTwinService,
    CoreFlowSimulationService,
    CoreFlowRouterService,
    CoreFlowFederationService,
    CoreFlowAutonomousOperationsService,
    CoreFlowReleaseService,
    CoreFlowBenchmarkService,
    CoreFlowExperimentService,
    CoreFlowAutonomyService,
    CoreFlowAutonomyPolicyService,
    WorkflowsService,
    CoreFlowAuditService,
    CoreFlowOutboxService,
    CoreFlowPolicyService,
    CoreFlowSnapshotService,
    CoreFlowWorkerService,
    CoreFlowSagaService,
    CoreFlowSchedulerService,
    CoreFlowRateLimitService,
    CoreFlowCircuitBreakerService,
    CoreFlowObservabilityService,
    CoreFlowRulesService,
    CoreFlowApprovalService,
    CoreFlowTimeoutService,
    CoreFlowProcessManagerService,
    CoreFlowRiskService,
    CoreFlowPolicyEngineService,
    CoreFlowComplianceService,
    CoreFlowEscalationService,
    CoreFlowGovernanceService,
    CoreFlowTenancyService,
    CoreFlowSlaService,
    CoreFlowCostService,
    CoreFlowLineageService,
    CoreFlowRetentionService,
    CoreFlowPrivacyService,
    CoreFlowChaosService,
    CoreFlowContractService,
    CoreFlowEnterpriseService,
    CoreFlowAnomalyService,
    CoreFlowRecommendationService,
    CoreFlowForecastService,
    CoreFlowOptimizationService,
    CoreFlowLearningService,
    CoreFlowIntelligenceService,
  ],
})
export class WorkflowsModule {}
