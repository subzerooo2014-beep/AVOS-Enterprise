import { Injectable } from "@nestjs/common";
import {
  GovernanceArchiveStatus,
  GovernanceCheckpointStatus,
  GovernanceDataLifecycleSnapshot,
  GovernanceRestoreStatus,
  GovernanceRetentionStatus,
} from "../contracts";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";

@Injectable()
export class RuntimeGovernanceDataLifecycleStatusService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
  ) {}

  snapshot():
    GovernanceDataLifecycleSnapshot {
    const checkpoints =
      this.store
        .listGovernanceCheckpoints();

    const policies =
      this.store
        .listGovernanceRetentionPolicies();

    const archives =
      this.store
        .listGovernanceArchives();

    const restores =
      this.store
        .listGovernanceRestorePlans();

    return {
      checkpoints:
        checkpoints.length,
      verifiedCheckpoints:
        checkpoints.filter(
          (item) =>
            item.status ===
            GovernanceCheckpointStatus.VERIFIED,
        ).length,
      invalidCheckpoints:
        checkpoints.filter(
          (item) =>
            item.status ===
            GovernanceCheckpointStatus.INVALID,
        ).length,
      restoreReadyCheckpoints:
        checkpoints.filter(
          (item) =>
            item.status ===
            GovernanceCheckpointStatus.RESTORE_READY,
        ).length,
      retentionPolicies:
        policies.length,
      activeRetentionPolicies:
        policies.filter(
          (item) =>
            item.status ===
            GovernanceRetentionStatus.ACTIVE,
        ).length,
      retentionEvaluations:
        this.store
          .listGovernanceRetentionEvaluations()
          .length,
      archives:
        archives.length,
      readyArchives:
        archives.filter(
          (item) =>
            item.status ===
            GovernanceArchiveStatus.READY,
        ).length,
      verifiedArchives:
        archives.filter(
          (item) =>
            item.status ===
            GovernanceArchiveStatus.VERIFIED,
        ).length,
      failedArchives:
        archives.filter(
          (item) =>
            item.status ===
            GovernanceArchiveStatus.FAILED,
        ).length,
      restorePlans:
        restores.length,
      readyRestorePlans:
        restores.filter(
          (item) =>
            item.status ===
            GovernanceRestoreStatus.READY,
        ).length,
      successfulRestorePlans:
        restores.filter(
          (item) =>
            item.status ===
            GovernanceRestoreStatus.SUCCEEDED,
        ).length,
      failedRestorePlans:
        restores.filter(
          (item) =>
            item.status ===
            GovernanceRestoreStatus.FAILED,
        ).length,
      generatedAt:
        new Date().toISOString(),
    };
  }
}
