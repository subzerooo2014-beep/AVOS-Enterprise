import { Injectable } from "@nestjs/common";
import {
  DeltaResult,
  HistoricalSnapshot,
} from "./omega-executive.types";

@Injectable()
export class DeltaComparisonEngineService {
  compare(
    baseline: HistoricalSnapshot,
    current: HistoricalSnapshot,
  ): DeltaResult {
    const readinessDelta = current.readinessScore - baseline.readinessScore;
    const riskDelta = current.riskScore - baseline.riskScore;
    const openIssuesDelta = current.openIssues - baseline.openIssues;
    const certifiedAssetsDelta =
      current.certifiedAssets - baseline.certifiedAssets;
    const pendingApprovalsDelta =
      current.pendingApprovals - baseline.pendingApprovals;

    const composite =
      readinessDelta -
      riskDelta -
      openIssuesDelta +
      certifiedAssetsDelta -
      pendingApprovalsDelta;

    return {
      baselineSnapshotId: baseline.snapshotId,
      currentSnapshotId: current.snapshotId,
      readinessDelta,
      riskDelta,
      openIssuesDelta,
      certifiedAssetsDelta,
      pendingApprovalsDelta,
      overallDirection:
        composite > 1
          ? "improving"
          : composite < -1
            ? "declining"
            : "stable",
    };
  }
}
