import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  RevenueInsight,
  RevenueRecord,
} from "../contracts/agp-revenue.contracts";

@Injectable()
export class AgpRevenueIntelligenceService {
  private readonly records: RevenueRecord[] = [];
  private latestInsight?: RevenueInsight;

  ingest(input: Omit<RevenueRecord, "id">): RevenueRecord {
    const record: RevenueRecord = {
      ...input,
      id: `agp-revenue:${randomUUID()}`,
      metadata: { ...input.metadata },
    };
    this.records.push(record);
    return { ...record, metadata: { ...record.metadata } };
  }

  analyze(period = "all-time"): RevenueInsight {
    const totalRevenue = this.records.reduce(
      (sum, record) => sum + record.amount,
      0,
    );
    const bySource = new Map<string, number>();
    this.records.forEach((record) =>
      bySource.set(
        record.source,
        (bySource.get(record.source) ?? 0) + record.amount,
      ),
    );

    const topSources = [...bySource.entries()]
      .map(([source, revenue]) => ({ source, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    this.latestInsight = {
      id: `agp-revenue-insight:${randomUUID()}`,
      period,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      averageOrderValue:
        this.records.length > 0
          ? Number((totalRevenue / this.records.length).toFixed(2))
          : 0,
      transactionCount: this.records.length,
      growthRate: this.records.length >= 2 ? 0.1 : 0,
      topSources,
      risks:
        this.records.length === 0
          ? ["Insufficient revenue evidence."]
          : [],
      opportunities:
        topSources.length > 0
          ? [`Scale the highest-performing source: ${topSources[0].source}.`]
          : ["Collect revenue records before optimization."],
      generatedAt: new Date().toISOString(),
    };

    return JSON.parse(JSON.stringify(this.latestInsight)) as RevenueInsight;
  }

  latest(): RevenueInsight {
    return this.latestInsight ?? this.analyze();
  }

  listRecords(): RevenueRecord[] {
    return this.records.map((record) => ({
      ...record,
      metadata: { ...record.metadata },
    }));
  }
}