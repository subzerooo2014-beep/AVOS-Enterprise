import { Injectable } from "@nestjs/common";
import {
  GovernanceJsonValue,
  GovernanceSnapshotScope,
  GovernanceSnapshotSection,
} from "../contracts";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  governanceSha256Json,
} from "../utils";

@Injectable()
export class RuntimeGovernanceSnapshotBuilderService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
  ) {}

  build(
    scope: GovernanceSnapshotScope,
  ): GovernanceSnapshotSection[] {
    const sections:
      GovernanceSnapshotSection[] = [];

    const addSection = (
      key: string,
      value: GovernanceJsonValue,
    ): void => {
      const count =
        Array.isArray(value)
          ? value.length
          : 1;

      sections.push({
        key,
        count,
        checksum:
          governanceSha256Json(value),
        data:
          value,
      });
    };

    if (
      scope ===
        GovernanceSnapshotScope.FULL ||
      scope ===
        GovernanceSnapshotScope.GOVERNANCE ||
      scope ===
        GovernanceSnapshotScope.REQUESTS
    ) {
      addSection(
        "governanceRequests",
        this.store
          .listGovernanceRequests() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "changeWindows",
        this.store
          .listChangeWindows() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "maintenanceModes",
        this.store
          .listMaintenanceModes() as unknown as
          GovernanceJsonValue,
      );
    }

    if (
      scope ===
        GovernanceSnapshotScope.FULL ||
      scope ===
        GovernanceSnapshotScope.DECISIONS
    ) {
      addSection(
        "decisionRecords",
        this.store
          .listDecisionRecords() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "approvalSuggestions",
        this.store
          .listApprovalSuggestions() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "guardrails",
        this.store
          .listGuardrails() as unknown as
          GovernanceJsonValue,
      );
    }

    if (
      scope ===
        GovernanceSnapshotScope.FULL ||
      scope ===
        GovernanceSnapshotScope.DEPENDENCIES
    ) {
      addSection(
        "dependencyNodes",
        this.store
          .listDependencyNodes() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "dependencyEdges",
        this.store
          .listDependencyEdges() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "cascadeAnalyses",
        this.store
          .listCascadeAnalyses() as unknown as
          GovernanceJsonValue,
      );
    }

    if (
      scope ===
        GovernanceSnapshotScope.FULL ||
      scope ===
        GovernanceSnapshotScope.SLO
    ) {
      addSection(
        "sloDefinitions",
        this.store
          .listSloDefinitions() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "sloEvaluations",
        this.store
          .listSloEvaluations() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "capacityPolicies",
        this.store
          .listCapacityPolicies() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "capacityEvaluations",
        this.store
          .listCapacityEvaluations() as unknown as
          GovernanceJsonValue,
      );
    }

    if (
      scope ===
        GovernanceSnapshotScope.FULL ||
      scope ===
        GovernanceSnapshotScope.EXECUTIONS
    ) {
      addSection(
        "runbooks",
        this.store
          .listRunbookDefinitions() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "runbookExecutions",
        this.store
          .listRunbookExecutions() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "changeExecutions",
        this.store
          .listChangeExecutions() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "recoveryPlans",
        this.store
          .listRecoveryPlans() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "isolationPlans",
        this.store
          .listIsolationPlans() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "executionLocks",
        this.store
          .listExecutionLocks() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "executionEvidence",
        this.store
          .listExecutionEvidence() as unknown as
          GovernanceJsonValue,
      );
    }

    if (
      scope ===
        GovernanceSnapshotScope.FULL ||
      scope ===
        GovernanceSnapshotScope.OPERATIONS
    ) {
      addSection(
        "schedules",
        this.store
          .listGovernanceSchedules() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "scheduleRuns",
        this.store
          .listGovernanceScheduleRuns() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "escalations",
        this.store
          .listGovernanceEscalations() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "notifications",
        this.store
          .listGovernanceNotifications() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "timeline",
        this.store
          .listGovernanceTimeline() as unknown as
          GovernanceJsonValue,
      );
    }

    if (
      scope ===
        GovernanceSnapshotScope.FULL ||
      scope ===
        GovernanceSnapshotScope.SECURITY
    ) {
      addSection(
        "auditEntries",
        this.store
          .listAuditEntries() as unknown as
          GovernanceJsonValue,
      );

      addSection(
        "controlMode",
        this.store
          .getControlMode() as unknown as
          GovernanceJsonValue,
      );
    }

    return sections;
  }

  rootChecksum(
    sections:
      GovernanceSnapshotSection[],
  ): string {
    return governanceSha256Json(
      sections.map(
        (section) => ({
          key:
            section.key,
          count:
            section.count,
          checksum:
            section.checksum,
        }),
      ),
    );
  }
}
