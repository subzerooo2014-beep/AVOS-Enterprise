import { Injectable } from "@nestjs/common";
import {
  CapacityEvaluationStatus,
  DependencyHealthStatus,
  GovernanceArchiveStatus,
  GovernanceCheckpointStatus,
  GovernanceEscalationSeverity,
  GovernanceEscalationStatus,
  GovernanceNotificationStatus,
  GovernanceRequestStatus,
  GovernanceRestoreStatus,
  GovernanceRetentionStatus,
  GovernanceScheduleRunStatus,
  GovernanceScheduleStatus,
  GuardrailEvaluationResult,
  RuntimeChangeExecutionStatus,
  RuntimeDecisionRecordStatus,
  RuntimeLockStatus,
  RuntimeRunbookExecutionStatus,
  RuntimeRunbookStatus,
  SloComplianceStatus,
} from "../contracts";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeExecutionEvidenceService,
} from "./runtime-execution-evidence.service";
import {
  RuntimeGovernanceAuditService,
} from "./runtime-governance-audit.service";

@Injectable()
export class ProductionHardeningV8MegaPack4StatusService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly audit:
      RuntimeGovernanceAuditService,
    private readonly executionEvidence:
      RuntimeExecutionEvidenceService,
  ) {}

  snapshot() {
    const auditIntegrity =
      this.audit.verify();

    const executionIntegrity =
      this.executionEvidence.verify();

    const requests =
      this.store.listGovernanceRequests();

    const windows =
      this.store.listChangeWindows();

    const maintenanceModes =
      this.store.listMaintenanceModes();

    const dependencyNodes =
      this.store.listDependencyNodes();

    const dependencyEdges =
      this.store.listDependencyEdges();

    const cascadeAnalyses =
      this.store.listCascadeAnalyses();

    const sloDefinitions =
      this.store.listSloDefinitions();

    const sloEvaluations =
      this.store.listSloEvaluations();

    const recommendations =
      this.store.listRecommendations();

    const simulations =
      this.store.listSimulations();

    const impactAnalyses =
      this.store.listImpactAnalyses();

    const approvalRules =
      this.store.listApprovalMatrixRules();

    const recoveryPlans =
      this.store.listRecoveryPlans();

    const isolationPlans =
      this.store.listIsolationPlans();

    const capacityPolicies =
      this.store.listCapacityPolicies();

    const capacityEvaluations =
      this.store.listCapacityEvaluations();

    const decisionRecords =
      this.store.listDecisionRecords();

    const approvalSuggestions =
      this.store.listApprovalSuggestions();

    const guardrails =
      this.store.listGuardrails();

    const guardrailEvaluations =
      this.store.listGuardrailEvaluations();

    const runbooks =
      this.store.listRunbookDefinitions();

    const runbookExecutions =
      this.store.listRunbookExecutions();

    const changeExecutions =
      this.store.listChangeExecutions();

    const executionLocks =
      this.store.listExecutionLocks();

    const schedules =
      this.store.listGovernanceSchedules();

    const scheduleRuns =
      this.store.listGovernanceScheduleRuns();

    const escalations =
      this.store.listGovernanceEscalations();

    const notifications =
      this.store.listGovernanceNotifications();

    const checkpoints =
      this.store.listGovernanceCheckpoints();

    const retentionPolicies =
      this.store.listGovernanceRetentionPolicies();

    const retentionEvaluations =
      this.store.listGovernanceRetentionEvaluations();

    const archives =
      this.store.listGovernanceArchives();

    const restorePlans =
      this.store.listGovernanceRestorePlans();

    const unhealthyDependencies =
      dependencyNodes.filter(
        (item) =>
          item.healthStatus ===
            DependencyHealthStatus.UNHEALTHY ||
          item.healthStatus ===
            DependencyHealthStatus.UNAVAILABLE,
      ).length;

    const breachedSlos =
      sloEvaluations.filter(
        (item) =>
          item.complianceStatus ===
          SloComplianceStatus.BREACHED,
      ).length;

    const criticalCapacityEvaluations =
      capacityEvaluations.filter(
        (item) =>
          item.status ===
          CapacityEvaluationStatus.CRITICAL,
      ).length;

    const failedExecutions =
      changeExecutions.filter(
        (item) =>
          item.status ===
          RuntimeChangeExecutionStatus.FAILED,
      ).length;

    const failedRunbooks =
      runbookExecutions.filter(
        (item) =>
          item.status ===
          RuntimeRunbookExecutionStatus.FAILED,
      ).length;

    const criticalEscalations =
      escalations.filter(
        (item) =>
          (
            item.severity ===
              GovernanceEscalationSeverity.CRITICAL ||
            item.severity ===
              GovernanceEscalationSeverity.EMERGENCY
          ) &&
          (
            item.status ===
              GovernanceEscalationStatus.OPEN ||
            item.status ===
              GovernanceEscalationStatus.ACKNOWLEDGED ||
            item.status ===
              GovernanceEscalationStatus.IN_PROGRESS
          ),
      ).length;

    const integrityHealthy =
      auditIntegrity.valid &&
      executionIntegrity.valid;

    const unhealthy =
      !integrityHealthy ||
      failedExecutions > 0 ||
      failedRunbooks > 0 ||
      criticalEscalations > 0;

    const degraded =
      unhealthyDependencies > 0 ||
      breachedSlos > 0 ||
      criticalCapacityEvaluations > 0 ||
      requests.some(
        (item) =>
          item.status ===
            GovernanceRequestStatus.DEFERRED ||
          item.status ===
            GovernanceRequestStatus.EVALUATING,
      );

    const healthStatus =
      unhealthy
        ? "unhealthy"
        : degraded
          ? "degraded"
          : "healthy";

    return {
      success: true,
      system:
        "AVOS Production Hardening V8 — Mega Pack 4",
      version:
        "v8-mega-pack-4",
      healthStatus,
      controlMode:
        this.store.getControlMode(),
      evidenceChainVerified:
        auditIntegrity.valid,
      executionEvidenceVerified:
        executionIntegrity.valid,

      governanceRequests:
        requests.length,
      pendingRequests:
        requests.filter(
          (item) =>
            item.status ===
            GovernanceRequestStatus.PENDING,
        ).length,
      approvedRequests:
        requests.filter(
          (item) =>
            item.status ===
            GovernanceRequestStatus.APPROVED,
        ).length,
      rejectedRequests:
        requests.filter(
          (item) =>
            item.status ===
            GovernanceRequestStatus.REJECTED,
        ).length,
      deferredRequests:
        requests.filter(
          (item) =>
            item.status ===
            GovernanceRequestStatus.DEFERRED,
        ).length,
      executedRequests:
        requests.filter(
          (item) =>
            item.status ===
            GovernanceRequestStatus.EXECUTED,
        ).length,

      changeWindows:
        windows.length,
      maintenanceModes:
        maintenanceModes.length,

      dependencyNodes:
        dependencyNodes.length,
      dependencyEdges:
        dependencyEdges.length,
      unhealthyDependencies,

      cascadeAnalyses:
        cascadeAnalyses.length,

      sloDefinitions:
        sloDefinitions.length,
      enabledSloDefinitions:
        sloDefinitions.filter(
          (item) =>
            item.enabled,
        ).length,
      sloEvaluations:
        sloEvaluations.length,
      breachedSlos,

      recommendations:
        recommendations.length,
      simulations:
        simulations.length,
      impactAnalyses:
        impactAnalyses.length,
      approvalMatrixRules:
        approvalRules.length,

      recoveryPlans:
        recoveryPlans.length,
      isolationPlans:
        isolationPlans.length,

      capacityPolicies:
        capacityPolicies.length,
      capacityEvaluations:
        capacityEvaluations.length,
      criticalCapacityEvaluations,

      decisionRecords:
        decisionRecords.length,
      pendingDecisionReviews:
        decisionRecords.filter(
          (item) =>
            item.status ===
            RuntimeDecisionRecordStatus.PENDING_REVIEW,
        ).length,
      approvalSuggestions:
        approvalSuggestions.length,

      guardrails:
        guardrails.length,
      guardrailEvaluations:
        guardrailEvaluations.length,
      failedGuardrails:
        guardrailEvaluations.filter(
          (item) =>
            item.result ===
            GuardrailEvaluationResult.FAILED,
        ).length,

      runbooks:
        runbooks.length,
      activeRunbooks:
        runbooks.filter(
          (item) =>
            item.status ===
            RuntimeRunbookStatus.ACTIVE,
        ).length,
      runbookExecutions:
        runbookExecutions.length,
      failedRunbookExecutions:
        failedRunbooks,

      changeExecutions:
        changeExecutions.length,
      activeChangeExecutions:
        changeExecutions.filter(
          (item) =>
            item.status ===
              RuntimeChangeExecutionStatus.EXECUTING ||
            item.status ===
              RuntimeChangeExecutionStatus.VERIFYING ||
            item.status ===
              RuntimeChangeExecutionStatus.VALIDATING,
        ).length,
      failedChangeExecutions:
        failedExecutions,

      executionLocks:
        executionLocks.length,
      activeExecutionLocks:
        executionLocks.filter(
          (item) =>
            item.status ===
            RuntimeLockStatus.ACTIVE,
        ).length,

      schedules:
        schedules.length,
      activeSchedules:
        schedules.filter(
          (item) =>
            item.status ===
            GovernanceScheduleStatus.ACTIVE,
        ).length,
      scheduleRuns:
        scheduleRuns.length,
      failedScheduleRuns:
        scheduleRuns.filter(
          (item) =>
            item.status ===
            GovernanceScheduleRunStatus.FAILED,
        ).length,

      escalations:
        escalations.length,
      openEscalations:
        escalations.filter(
          (item) =>
            item.status ===
              GovernanceEscalationStatus.OPEN ||
            item.status ===
              GovernanceEscalationStatus.ACKNOWLEDGED ||
            item.status ===
              GovernanceEscalationStatus.IN_PROGRESS,
        ).length,
      criticalEscalations,

      notifications:
        notifications.length,
      pendingNotifications:
        notifications.filter(
          (item) =>
            item.status ===
              GovernanceNotificationStatus.PENDING ||
            item.status ===
              GovernanceNotificationStatus.QUEUED,
        ).length,

      timelineEvents:
        this.store
          .listGovernanceTimeline()
          .length,

      checkpoints:
        checkpoints.length,
      verifiedCheckpoints:
        checkpoints.filter(
          (item) =>
            item.status ===
            GovernanceCheckpointStatus.VERIFIED ||
            item.status ===
            GovernanceCheckpointStatus.RESTORE_READY,
        ).length,

      retentionPolicies:
        retentionPolicies.length,
      activeRetentionPolicies:
        retentionPolicies.filter(
          (item) =>
            item.status ===
            GovernanceRetentionStatus.ACTIVE,
        ).length,
      retentionEvaluations:
        retentionEvaluations.length,

      archives:
        archives.length,
      verifiedArchives:
        archives.filter(
          (item) =>
            item.status ===
            GovernanceArchiveStatus.VERIFIED,
        ).length,

      restorePlans:
        restorePlans.length,
      successfulRestorePlans:
        restorePlans.filter(
          (item) =>
            item.status ===
            GovernanceRestoreStatus.SUCCEEDED,
        ).length,

      auditEntries:
        this.store
          .listAuditEntries()
          .length,
      executionEvidenceEntries:
        this.store
          .listExecutionEvidence()
          .length,

      generatedAt:
        new Date().toISOString(),
    };
  }
}
