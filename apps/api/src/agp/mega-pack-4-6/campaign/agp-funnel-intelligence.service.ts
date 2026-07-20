import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  FunnelSnapshot,
  FunnelStage,
} from "../contracts/agp-growth-commercial.contracts";

@Injectable()
export class AgpFunnelIntelligenceService {
  private readonly snapshots: FunnelSnapshot[] = [];

  analyze(input: {
    name: string;
    campaignId?: string;
    stages: Array<{
      name: string;
      entrants: number;
      conversions: number;
    }>;
  }): FunnelSnapshot {
    const stages: FunnelStage[] = input.stages.map((stage, index) => {
      const conversionRate =
        stage.entrants > 0 ? stage.conversions / stage.entrants : 0;
      return {
        id: `agp-funnel-stage:${randomUUID()}`,
        name: stage.name,
        order: index + 1,
        entrants: stage.entrants,
        conversions: stage.conversions,
        conversionRate: Number(conversionRate.toFixed(4)),
        dropOffRate: Number((1 - conversionRate).toFixed(4)),
      };
    });

    const first = stages[0]?.entrants ?? 0;
    const last = stages[stages.length - 1]?.conversions ?? 0;
    const bottleneck = [...stages].sort(
      (a, b) => b.dropOffRate - a.dropOffRate,
    )[0];

    const snapshot: FunnelSnapshot = {
      id: `agp-funnel:${randomUUID()}`,
      name: input.name,
      campaignId: input.campaignId,
      stages,
      overallConversionRate:
        first > 0 ? Number((last / first).toFixed(4)) : 0,
      bottleneckStage: bottleneck?.name,
      generatedAt: new Date().toISOString(),
    };

    this.snapshots.push(snapshot);
    return JSON.parse(JSON.stringify(snapshot)) as FunnelSnapshot;
  }

  list(): FunnelSnapshot[] {
    return this.snapshots.map(
      (snapshot) => JSON.parse(JSON.stringify(snapshot)) as FunnelSnapshot,
    );
  }
}