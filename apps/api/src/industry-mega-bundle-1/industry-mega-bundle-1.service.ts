import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { INDUSTRY_CAPABILITIES } from "./industry-mega-bundle-1.registry";
import {
  IndustryAiInsight,
  IndustryCode,
  IndustryMetric,
  IndustryRecord,
} from "./industry-mega-bundle-1.types";

@Injectable()
export class IndustryMegaBundle1Service {
  private readonly records = new Map<string, IndustryRecord>();
  private readonly insights = new Map<string, IndustryAiInsight>();
  private readonly metrics: IndustryMetric[] = [];
  private readonly codeIndex = new Map<string, string>();

  framework() {
    return {
      system: "AVOS Industry Mega Bundle 1",
      industries: Object.keys(INDUSTRY_CAPABILITIES),
      capabilities: structuredClone(INDUSTRY_CAPABILITIES),
      status: "READY",
    };
  }

  createRecord(
    industry: IndustryCode,
    input: Omit<IndustryRecord, "id" | "industry" | "status" | "createdAt" | "updatedAt">,
  ) {
    const code = `${industry}:${input.code.trim().toUpperCase()}`;

    if (!input.name.trim()) {
      throw new Error("Record name is required");
    }

    if (this.codeIndex.has(code)) {
      throw new Error(`Duplicate industry record code: ${code}`);
    }

    const now = new Date().toISOString();

    const record: IndustryRecord = {
      ...input,
      id: randomUUID(),
      industry,
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      status: "DRAFT",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);
    this.codeIndex.set(code, record.id);

    return this.cloneRecord(record);
  }

  activateRecord(id: string) {
    const record = this.requireRecord(id);
    record.status = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    this.records.set(id, record);
    return this.cloneRecord(record);
  }

  completeRecord(id: string) {
    const record = this.requireRecord(id);
    record.status = "COMPLETED";
    record.updatedAt = new Date().toISOString();
    this.records.set(id, record);
    return this.cloneRecord(record);
  }

  recordMetric(input: IndustryMetric) {
    if (!Number.isFinite(input.value)) {
      throw new Error("Metric value must be finite");
    }

    const metric: IndustryMetric = {
      ...input,
      recordedAt: input.recordedAt || new Date().toISOString(),
    };

    this.metrics.push(metric);
    return { ...metric };
  }

  createInsight(
    input: Omit<IndustryAiInsight, "id" | "createdAt">,
  ) {
    if (input.score < 0 || input.score > 100) {
      throw new Error("Insight score must be between 0 and 100");
    }

    const insight: IndustryAiInsight = {
      ...input,
      id: randomUUID(),
      factors: [...input.factors],
      createdAt: new Date().toISOString(),
    };

    this.insights.set(insight.id, insight);
    return this.cloneInsight(insight);
  }

  listRecords(industry?: IndustryCode, tenantId?: string) {
    return Array.from(this.records.values())
      .filter((item) => !industry || item.industry === industry)
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .map((item) => this.cloneRecord(item));
  }

  dashboard(industry?: IndustryCode) {
    const records = Array.from(this.records.values()).filter(
      (item) => !industry || item.industry === industry,
    );

    const metrics = this.metrics.filter(
      (item) => !industry || item.industry === industry,
    );

    const insights = Array.from(this.insights.values()).filter(
      (item) => !industry || item.industry === industry,
    );

    return {
      industry: industry ?? "ALL",
      records: records.length,
      active: records.filter((item) => item.status === "ACTIVE").length,
      completed: records.filter((item) => item.status === "COMPLETED").length,
      metrics: metrics.length,
      insights: insights.length,
      averageInsightScore:
        insights.length === 0
          ? 0
          : Number(
              (
                insights.reduce((sum, item) => sum + item.score, 0) /
                insights.length
              ).toFixed(2),
            ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requireRecord(id: string) {
    const record = this.records.get(id);
    if (!record) throw new Error(`Industry record not found: ${id}`);
    return record;
  }

  private cloneRecord(record: IndustryRecord): IndustryRecord {
    return { ...record, metadata: { ...record.metadata } };
  }

  private cloneInsight(insight: IndustryAiInsight): IndustryAiInsight {
    return { ...insight, factors: [...insight.factors] };
  }
}