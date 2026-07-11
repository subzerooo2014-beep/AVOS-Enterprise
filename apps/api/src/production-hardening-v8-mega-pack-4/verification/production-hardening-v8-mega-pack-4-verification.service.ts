import { Injectable } from "@nestjs/common";
import {
  ChangeWindowStatus,
  ChangeWindowType,
  DependencyHealthStatus,
  DependencyNodeType,
  GovernanceApprovalTier,
  GovernanceArchiveType,
  GovernanceDataClassification,
  GovernanceEnvironment,
  GovernanceRequestType,
  GovernanceRiskLevel,
  GovernanceSnapshotScope,
  GovernanceCheckpointType,
  RuntimeRunbookStatus,
  RuntimeRunbookStepType,
} from "../contracts";
import {
  RuntimeCapacityGovernanceService,
  RuntimeChangeWindowService,
  RuntimeDependencyGraphService,
  RuntimeGovernanceApprovalMatrixService,
  RuntimeGovernanceArchiveService,
  RuntimeGovernanceAuditService,
  RuntimeGovernanceCheckpointService,
  RuntimeGovernanceControlModeService,
  RuntimeGovernanceDashboardService,
  RuntimeGovernanceDataLifecycleStatusService,
  RuntimeGovernanceOperationsStatusService,
  RuntimeGovernanceRetentionService,
  RuntimeRunbookService,
  RuntimeSloService,
  ProductionHardeningV8MegaPack4StatusService,
} from "../services";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";

@Injectable()
export class ProductionHardeningV8MegaPack4VerificationService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly controlMode:
      RuntimeGovernanceControlModeService,
    private readonly changeWindows:
      RuntimeChangeWindowService,
    private readonly dependencies:
      RuntimeDependencyGraphService,
    private readonly slos:
      RuntimeSloService,
    private readonly capacity:
      RuntimeCapacityGovernanceService,
    private readonly matrix:
      RuntimeGovernanceApprovalMatrixService,
    private readonly runbooks:
      RuntimeRunbookService,
    private readonly checkpoints:
      RuntimeGovernanceCheckpointService,
    private readonly archives:
      RuntimeGovernanceArchiveService,
    private readonly retention:
      RuntimeGovernanceRetentionService,
    private readonly audit:
      RuntimeGovernanceAuditService,
    private readonly dashboard:
      RuntimeGovernanceDashboardService,
    private readonly operations:
      RuntimeGovernanceOperationsStatusService,
    private readonly lifecycle:
      RuntimeGovernanceDataLifecycleStatusService,
    private readonly status:
      ProductionHardeningV8MegaPack4StatusService,
  ) {}

  async run() {
    this.store.clear();

    const actor = {
      id:
        "avos-v8-mega-pack-4-verifier",
      type:
        "system" as const,
      name:
        "AVOS V8 Mega Pack 4 Verifier",
      roles: [
        "runtime_governance",
        "verification",
        "platform_admin",
      ],
    };

    const checks: Array<{
      name: string;
      passed: boolean;
      details?: unknown;
    }> = [];

    const controlMode =
      this.controlMode.get();

    checks.push({
      name:
        "control_mode_initialized",
      passed:
        controlMode.controlMode ===
        "enforce",
      details:
        controlMode,
    });

    const now =
      Date.now();

    const changeWindow =
      this.changeWindows.create({
        key:
          "verification-standard-window",
        name:
          "Verification Standard Window",
        description:
          "Mega Pack 4 verification window",
        environment:
          GovernanceEnvironment.PRODUCTION,
        namespace:
          "avos",
        type:
          ChangeWindowType.STANDARD,
        startsAt:
          new Date(
            now - 60000,
          ).toISOString(),
        endsAt:
          new Date(
            now + 3600000,
          ).toISOString(),
        timezone:
          "Asia/Dubai",
        allowedRequestTypes: [
          GovernanceRequestType.DEPLOYMENT,
          GovernanceRequestType.CONFIGURATION_CHANGE,
        ],
        blockedRequestTypes: [],
        maximumRiskLevel:
          GovernanceRiskLevel.HIGH,
        requiresApproval:
          true,
        requiredApprovalCount:
          1,
        tags: [
          "verification",
        ],
        metadata: {},
        actor,
      });

    const openedWindow =
      this.changeWindows.updateStatus(
        changeWindow.id,
        {
          status:
            ChangeWindowStatus.SCHEDULED,
          reason:
            "Verification schedule",
          actor,
        },
      );

    const normalizedWindow =
      this.changeWindows.get(
        openedWindow.id,
      );

    checks.push({
      name:
        "change_window_created",
      passed:
        Boolean(
          normalizedWindow.id,
        ),
      details:
        normalizedWindow.status,
    });

    const databaseNode =
      this.dependencies.createNode({
        key:
          "verification-database",
        name:
          "Verification Database",
        type:
          DependencyNodeType.DATABASE,
        environment:
          GovernanceEnvironment.PRODUCTION,
        namespace:
          "avos",
        service:
          "verification-api",
        criticality:
          90,
        healthStatus:
          DependencyHealthStatus.HEALTHY,
        healthScore:
          100,
        region:
          "uae",
        zone:
          "primary",
        owner:
          "platform",
        tags: [
          "verification",
        ],
        metadata: {},
      });

    const serviceNode =
      this.dependencies.createNode({
        key:
          "verification-api",
        name:
          "Verification API",
        type:
          DependencyNodeType.SERVICE,
        environment:
          GovernanceEnvironment.PRODUCTION,
        namespace:
          "avos",
        service:
          "verification-api",
        criticality:
          80,
        healthStatus:
          DependencyHealthStatus.HEALTHY,
        healthScore:
          100,
        region:
          "uae",
        zone:
          "primary",
        owner:
          "platform",
        tags: [
          "verification",
        ],
        metadata: {},
      });

    const dependencyEdge =
      this.dependencies.createEdge({
        sourceNodeId:
          serviceNode.id,
        targetNodeId:
          databaseNode.id,
        relationshipType:
          "hard" as never,
        criticality:
          90,
        timeoutMilliseconds:
          3000,
        retryEnabled:
          true,
        metadata: {},
      });

    checks.push({
      name:
        "dependency_graph_created",
      passed:
        Boolean(
          dependencyEdge.id,
        ) &&
        this.store
          .listDependencyNodes()
          .length === 2,
      details: {
        nodes:
          this.store
            .listDependencyNodes()
            .length,
        edges:
          this.store
            .listDependencyEdges()
            .length,
      },
    });

    const slo =
      this.slos.create({
        key:
          "verification-availability",
        name:
          "Verification Availability",
        description:
          "Availability verification SLO",
        environment:
          GovernanceEnvironment.PRODUCTION,
        namespace:
          "avos",
        service:
          "verification-api",
        metric:
          "availability_percentage",
        target:
          99.9,
        warningThreshold:
          99.5,
        breachThreshold:
          99,
        evaluationWindowMinutes:
          5,
        enabled:
          true,
        metadata: {},
        actor,
      });

    const sloEvaluation =
      this.slos.evaluate(
        slo.id,
        {
          actualValue:
            99.95,
          observedAt:
            new Date().toISOString(),
          metadata: {},
        },
      );

    checks.push({
      name:
        "slo_evaluation_compliant",
      passed:
        sloEvaluation.complianceStatus ===
        "compliant",
      details:
        sloEvaluation,
    });

    const capacityPolicy =
      this.capacity.create({
        key:
          "verification-cpu",
        name:
          "Verification CPU Policy",
        description:
          "Verification capacity policy",
        environment:
          GovernanceEnvironment.PRODUCTION,
        namespace:
          "avos",
        service:
          "verification-api",
        metricType:
          "cpu" as never,
        metricName:
          "cpu_percentage",
        thresholds: {
          warning:
            70,
          critical:
            90,
          scaleOut:
            80,
          scaleIn:
            25,
        },
        minimumInstances:
          1,
        maximumInstances:
          10,
        scaleStep:
          1,
        cooldownSeconds:
          60,
        allowAutomaticScaling:
          true,
        blockChangesWhenCritical:
          true,
        metadata: {},
        actor,
      });

    const capacityEvaluation =
      this.capacity.evaluate(
        capacityPolicy.id,
        {
          actualValue:
            40,
          currentInstances:
            2,
          observedAt:
            new Date().toISOString(),
          metadata: {},
        },
      );

    checks.push({
      name:
        "capacity_evaluation_healthy",
      passed:
        capacityEvaluation.status ===
        "healthy",
      details:
        capacityEvaluation,
    });

    const matrixRule =
      this.matrix.createRule({
        name:
          "Verification Standard Approval",
        environment:
          GovernanceEnvironment.PRODUCTION,
        requestTypes: [
          GovernanceRequestType.DEPLOYMENT,
        ],
        minimumRiskLevel:
          GovernanceRiskLevel.LOW,
        maximumRiskLevel:
          GovernanceRiskLevel.HIGH,
        minimumBlastRadius:
          0,
        minimumBusinessCriticality:
          0,
        rollbackPlanRequired:
          true,
        minimumTestCoverage:
          75,
        tier:
          GovernanceApprovalTier.STANDARD,
        requiredApprovals:
          1,
        requiredRoles: [
          "platform_admin",
        ],
        enabled:
          true,
        priority:
          100,
        metadata: {},
      });

    checks.push({
      name:
        "approval_matrix_rule_created",
      passed:
        Boolean(
          matrixRule.id,
        ),
      details:
        matrixRule.tier,
    });

    const runbook =
      this.runbooks.create({
        key:
          "verification-deployment-runbook",
        name:
          "Verification Deployment Runbook",
        description:
          "Mega Pack 4 runbook verification",
        environment:
          GovernanceEnvironment.PRODUCTION,
        namespace:
          "avos",
        service:
          "verification-api",
        requestTypes: [
          GovernanceRequestType.DEPLOYMENT,
        ],
        minimumRiskLevel:
          GovernanceRiskLevel.INFORMATIONAL,
        maximumRiskLevel:
          GovernanceRiskLevel.HIGH,
        requiresApproval:
          false,
        requiredRoles: [],
        steps: [
          {
            id:
              "verify-preflight",
            name:
              "Verify Preflight",
            description:
              "Verify runtime preflight",
            type:
              RuntimeRunbookStepType.VALIDATE,
            order:
              1,
            required:
              true,
            timeoutSeconds:
              30,
            retryLimit:
              0,
            continueOnFailure:
              false,
            parameters: {
              verification:
                true,
            },
          },
          {
            id:
              "verify-health",
            name:
              "Verify Health",
            description:
              "Verify runtime health",
            type:
              RuntimeRunbookStepType.HEALTH_CHECK,
            order:
              2,
            required:
              true,
            timeoutSeconds:
              30,
            retryLimit:
              0,
            continueOnFailure:
              false,
            parameters: {
              verification:
                true,
            },
          },
        ],
        tags: [
          "verification",
        ],
        metadata: {},
        actor,
      });

    const activeRunbook =
      this.runbooks.updateStatus(
        runbook.id,
        {
          status:
            RuntimeRunbookStatus.ACTIVE,
          reason:
            "Verification activation",
          actor,
        },
      );

    checks.push({
      name:
        "runbook_activated",
      passed:
        activeRunbook.status ===
        RuntimeRunbookStatus.ACTIVE,
      details:
        activeRunbook.version,
    });

    const runbookExecution =
      await this.runbooks.execute(
        activeRunbook.id,
        {
          dryRun:
            true,
          runtimeContext: {
            verification:
              true,
          },
          actor,
        },
      );

    checks.push({
      name:
        "runbook_execution_succeeded",
      passed:
        runbookExecution.status ===
        "succeeded",
      details: {
        status:
          runbookExecution.status,
        steps:
          runbookExecution
            .stepExecutions
            .length,
      },
    });

    const checkpoint =
      this.checkpoints.create({
        key:
          "verification-full-checkpoint",
        name:
          "Verification Full Checkpoint",
        description:
          "Mega Pack 4 verification checkpoint",
        type:
          GovernanceCheckpointType.BASELINE,
        scope:
          GovernanceSnapshotScope.FULL,
        environment:
          GovernanceEnvironment.PRODUCTION,
        namespace:
          "avos",
        service:
          "verification-api",
        metadata: {},
        actor,
      });

    const checkpointVerification =
      this.checkpoints.verify(
        checkpoint.id,
      );

    checks.push({
      name:
        "checkpoint_verified",
      passed:
        checkpointVerification.valid,
      details:
        checkpointVerification,
    });

    const restoreReadyCheckpoint =
      this.checkpoints.markRestoreReady(
        checkpoint.id,
      );

    checks.push({
      name:
        "checkpoint_restore_ready",
      passed:
        restoreReadyCheckpoint.status ===
        "restore_ready",
      details:
        restoreReadyCheckpoint.status,
    });

    const retentionPolicy =
      this.retention.create({
        key:
          "verification-retention",
        name:
          "Verification Retention Policy",
        description:
          "Verification archive retention",
        archiveTypes: [
          GovernanceArchiveType.CHECKPOINT,
          GovernanceArchiveType.FULL_EXPORT,
        ],
        classifications: [
          GovernanceDataClassification.INTERNAL,
        ],
        retentionDays:
          365,
        archiveAfterDays:
          30,
        compressAfterDays:
          60,
        redactAfterDays:
          300,
        deleteAfterDays:
          365,
        legalHold:
          false,
        immutable:
          true,
        environment:
          GovernanceEnvironment.PRODUCTION,
        namespace:
          "avos",
        metadata: {},
        actor,
      });

    checks.push({
      name:
        "retention_policy_created",
      passed:
        retentionPolicy.status ===
        "active",
      details:
        retentionPolicy.retentionDays,
    });

    const archive =
      this.archives.create({
        type:
          GovernanceArchiveType.CHECKPOINT,
        name:
          "Verification Checkpoint Archive",
        description:
          "Archive generated from verified checkpoint",
        classification:
          GovernanceDataClassification.INTERNAL,
        environment:
          GovernanceEnvironment.PRODUCTION,
        namespace:
          "avos",
        sourceResourceIds: [
          checkpoint.id,
        ],
        checkpointId:
          checkpoint.id,
        compressed:
          true,
        encrypted:
          true,
        immutable:
          true,
        retentionPolicyId:
          retentionPolicy.id,
        metadata: {},
        actor,
      });

    const archiveVerification =
      this.archives.verify(
        archive.id,
      );

    checks.push({
      name:
        "archive_verified",
      passed:
        archiveVerification.valid,
      details:
        archiveVerification,
    });

    const auditIntegrity =
      this.audit.verify();

    checks.push({
      name:
        "audit_chain_verified",
      passed:
        auditIntegrity.valid,
      details:
        auditIntegrity,
    });

    const dashboard =
      this.dashboard.snapshot();

    checks.push({
      name:
        "dashboard_available",
      passed:
        Boolean(
          dashboard.system,
        ) &&
        dashboard.evidenceChainVerified,
      details: {
        healthStatus:
          dashboard.healthStatus,
        auditEntries:
          dashboard.auditEntries,
      },
    });

    const operations =
      this.operations.snapshot();

    checks.push({
      name:
        "operations_snapshot_available",
      passed:
        Boolean(
          operations.generatedAt,
        ),
      details:
        operations,
    });

    const lifecycle =
      this.lifecycle.snapshot();

    checks.push({
      name:
        "data_lifecycle_snapshot_available",
      passed:
        lifecycle.checkpoints >= 1 &&
        lifecycle.archives >= 1,
      details:
        lifecycle,
    });

    const status =
      this.status.snapshot();

    checks.push({
      name:
        "system_status_available",
      passed:
        status.success === true &&
        status.evidenceChainVerified ===
          true &&
        status.executionEvidenceVerified ===
          true,
      details: {
        healthStatus:
          status.healthStatus,
        controlMode:
          status.controlMode,
      },
    });

    const passed =
      checks.filter(
        (check) =>
          check.passed,
      ).length;

    const failed =
      checks.length -
      passed;

    return {
      success:
        failed === 0,
      system:
        "AVOS Production Hardening V8 — Mega Pack 4",
      version:
        "v8-mega-pack-4",
      healthStatus:
        failed === 0
          ? "healthy"
          : "unhealthy",
      evidenceChainVerified:
        auditIntegrity.valid,
      executionEvidenceVerified:
        status.executionEvidenceVerified,
      controlMode:
        status.controlMode,

      changeWindows:
        status.changeWindows,
      dependencyNodes:
        status.dependencyNodes,
      dependencyEdges:
        status.dependencyEdges,
      sloDefinitions:
        status.sloDefinitions,
      sloEvaluations:
        status.sloEvaluations,
      capacityPolicies:
        status.capacityPolicies,
      capacityEvaluations:
        status.capacityEvaluations,
      approvalMatrixRules:
        status.approvalMatrixRules,
      runbooks:
        status.runbooks,
      activeRunbooks:
        status.activeRunbooks,
      runbookExecutions:
        status.runbookExecutions,
      checkpoints:
        status.checkpoints,
      verifiedCheckpoints:
        status.verifiedCheckpoints,
      retentionPolicies:
        status.retentionPolicies,
      archives:
        status.archives,
      verifiedArchives:
        status.verifiedArchives,
      auditEntries:
        status.auditEntries,

      verificationChecksPassed:
        passed,
      verificationChecksFailed:
        failed,
      checks,
      verifiedAt:
        new Date().toISOString(),
    };
  }
}
