import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { HistoricalSnapshot } from "./omega-executive.types";

@Injectable()
export class HistoricalTimelineService {
  private readonly snapshots: HistoricalSnapshot[] = [];

  capture(input: Omit<HistoricalSnapshot, "snapshotId" | "capturedAt">): HistoricalSnapshot {
    const snapshot: HistoricalSnapshot = {
      snapshotId: `OMEGA-SNAPSHOT-${randomUUID()}`,
      capturedAt: new Date().toISOString(),
      readinessScore: input.readinessScore,
      riskScore: input.riskScore,
      openIssues: input.openIssues,
      certifiedAssets: input.certifiedAssets,
      pendingApprovals: input.pendingApprovals,
    };

    this.snapshots.push(snapshot);
    return snapshot;
  }

  all(): readonly HistoricalSnapshot[] {
    return [...this.snapshots];
  }

  latest(): HistoricalSnapshot | null {
    return this.snapshots[this.snapshots.length - 1] ?? null;
  }

  get(snapshotId: string): HistoricalSnapshot | null {
    return this.snapshots.find((item) => item.snapshotId === snapshotId) ?? null;
  }

  seed(): readonly HistoricalSnapshot[] {
    if (this.snapshots.length > 0) {
      return this.all();
    }

    const base = [
      {
        readinessScore: 62,
        riskScore: 58,
        openIssues: 18,
        certifiedAssets: 6,
        pendingApprovals: 5,
      },
      {
        readinessScore: 69,
        riskScore: 49,
        openIssues: 14,
        certifiedAssets: 8,
        pendingApprovals: 4,
      },
      {
        readinessScore: 76,
        riskScore: 39,
        openIssues: 10,
        certifiedAssets: 11,
        pendingApprovals: 3,
      },
      {
        readinessScore: 84,
        riskScore: 28,
        openIssues: 6,
        certifiedAssets: 15,
        pendingApprovals: 2,
      },
    ];

    return base.map((item) => this.capture(item));
  }
}


