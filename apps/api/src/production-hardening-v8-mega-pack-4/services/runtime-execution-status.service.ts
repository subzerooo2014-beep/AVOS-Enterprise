import { Injectable } from "@nestjs/common";
import {
  RuntimeChangeExecutionStatus,
  RuntimeExecutionSnapshot,
  RuntimeLockStatus,
  RuntimeRunbookExecutionStatus,
  RuntimeRunbookStatus,
} from "../contracts";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeExecutionEvidenceService,
} from "./runtime-execution-evidence.service";

@Injectable()
export class RuntimeExecutionStatusService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly evidence:
      RuntimeExecutionEvidenceService,
  ) {}

  snapshot():
    RuntimeExecutionSnapshot {
    const runbooks =
      this.store
        .listRunbookDefinitions();

    const runbookExecutions =
      this.store
        .listRunbookExecutions();

    const changeExecutions =
      this.store
        .listChangeExecutions();

    const locks =
      this.store
        .listExecutionLocks();

    const integrity =
      this.evidence.verify();

    return {
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
      runningRunbookExecutions:
        runbookExecutions.filter(
          (item) =>
            item.status ===
            RuntimeRunbookExecutionStatus.RUNNING,
        ).length,
      failedRunbookExecutions:
        runbookExecutions.filter(
          (item) =>
            item.status ===
            RuntimeRunbookExecutionStatus.FAILED,
        ).length,
      changeExecutions:
        changeExecutions.length,
      activeChangeExecutions:
        changeExecutions.filter(
          (item) =>
            [
              RuntimeChangeExecutionStatus.VALIDATING,
              RuntimeChangeExecutionStatus.EXECUTING,
              RuntimeChangeExecutionStatus.VERIFYING,
            ].includes(
              item.status,
            ),
        ).length,
      blockedChangeExecutions:
        changeExecutions.filter(
          (item) =>
            item.status ===
            RuntimeChangeExecutionStatus.BLOCKED,
        ).length,
      failedChangeExecutions:
        changeExecutions.filter(
          (item) =>
            item.status ===
            RuntimeChangeExecutionStatus.FAILED,
        ).length,
      activeLocks:
        locks.filter(
          (item) =>
            item.status ===
            RuntimeLockStatus.ACTIVE,
        ).length,
      expiredLocks:
        locks.filter(
          (item) =>
            item.status ===
            RuntimeLockStatus.EXPIRED,
        ).length,
      executionEvidenceEntries:
        this.store
          .listExecutionEvidence()
          .length,
      evidenceChainVerified:
        integrity.valid,
      generatedAt:
        new Date().toISOString(),
    };
  }
}
