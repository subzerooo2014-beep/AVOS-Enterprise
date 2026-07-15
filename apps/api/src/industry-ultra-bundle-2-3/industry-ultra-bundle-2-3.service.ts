import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { INDUSTRY_ULTRA_REGISTRY } from "./industry-ultra-bundle-2-3.registry";
import {
  UltraIndustryCapability,
  UltraIndustryCode,
  UltraIndustryInsight,
  UltraIndustryRecord,
  UltraIndustryWorkflow,
} from "./industry-ultra-bundle-2-3.types";

@Injectable()
export class IndustryUltraBundle23Service {
  private readonly records = new Map<string, UltraIndustryRecord>();
  private readonly workflows = new Map<string, UltraIndustryWorkflow>();
  private readonly insights = new Map<string, UltraIndustryInsight>();
  private readonly codeIndex = new Set<string>();

  framework() {
    return {
      system: "AVOS Industry Ultra Bundle 2-3",
      status: "READY",
      industries: structuredClone(INDUSTRY_ULTRA_REGISTRY),
      industryCount: Object.keys(INDUSTRY_ULTRA_REGISTRY).length,
      totalCapabilities: Object.values(INDUSTRY_ULTRA_REGISTRY).reduce(
        (sum, item) => sum + item.capabilities.length,
        0,
      ),
    };
  }

  createRecord(
    industry: UltraIndustryCode,
    capability: UltraIndustryCapability,
    input: Omit<
      UltraIndustryRecord,
      "id" | "industry" | "capability" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    const pack = INDUSTRY_ULTRA_REGISTRY[industry];

    if (!pack) {
      throw new Error(`Unknown industry: ${industry}`);
    }

    if (!pack.capabilities.includes(capability)) {
      throw new Error(`Unsupported capability ${capability} for ${industry}`);
    }

    if (!input.name.trim() || !input.owner.trim()) {
      throw new Error("Record name and owner are required");
    }

    const key = `${industry}:${capability}:${input.code.trim().toUpperCase()}`;

    if (this.codeIndex.has(key)) {
      throw new Error(`Duplicate industry record code: ${key}`);
    }

    const now = new Date().toISOString();

    const record: UltraIndustryRecord = {
      ...input,
      id: randomUUID(),
      industry,
      capability,
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      owner: input.owner.trim(),
      status: "DRAFT",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);
    this.codeIndex.add(key);

    return this.cloneRecord(record);
  }

  activateRecord(id: string) {
    const record = this.requireRecord(id);
    record.status = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    this.records.set(id, record);
    return this.cloneRecord(record);
  }

  createWorkflow(
    recordId: string,
    input: Omit<
      UltraIndustryWorkflow,
      "id" | "recordId" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    this.requireRecord(recordId);

    const now = new Date().toISOString();

    const workflow: UltraIndustryWorkflow = {
      ...input,
      id: randomUUID(),
      recordId,
      status: "QUEUED",
      evidence: [...input.evidence],
      createdAt: now,
      updatedAt: now,
    };

    this.workflows.set(workflow.id, workflow);
    return this.cloneWorkflow(workflow);
  }

  startWorkflow(id: string) {
    const workflow = this.requireWorkflow(id);
    workflow.status = "RUNNING";
    workflow.startedAt = new Date().toISOString();
    workflow.updatedAt = workflow.startedAt;
    this.workflows.set(id, workflow);
    return this.cloneWorkflow(workflow);
  }

  completeWorkflow(id: string, evidence: string) {
    const workflow = this.requireWorkflow(id);

    if (workflow.status !== "RUNNING") {
      throw new Error("Workflow must be running before completion");
    }

    workflow.status = "COMPLETED";
    workflow.evidence.push(evidence);
    workflow.completedAt = new Date().toISOString();
    workflow.updatedAt = workflow.completedAt;
    this.workflows.set(id, workflow);

    return this.cloneWorkflow(workflow);
  }

  createInsight(
    recordId: string,
    input: Omit<UltraIndustryInsight, "id" | "recordId" | "createdAt">,
  ) {
    this.requireRecord(recordId);

    if (input.score < 0 || input.score > 100) {
      throw new Error("Insight score must be between 0 and 100");
    }

    const insight: UltraIndustryInsight = {
      ...input,
      id: randomUUID(),
      recordId,
      recommendations: [...input.recommendations],
      createdAt: new Date().toISOString(),
    };

    this.insights.set(insight.id, insight);
    return this.cloneInsight(insight);
  }

  listRecords(
    industry?: UltraIndustryCode,
    capability?: UltraIndustryCapability,
    tenantId?: string,
  ) {
    return Array.from(this.records.values())
      .filter((item) => !industry || item.industry === industry)
      .filter((item) => !capability || item.capability === capability)
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .map((item) => this.cloneRecord(item));
  }

  commandCenter(industry?: UltraIndustryCode) {
    const records = Array.from(this.records.values()).filter(
      (item) => !industry || item.industry === industry,
    );

    const recordIds = new Set(records.map((item) => item.id));

    const workflows = Array.from(this.workflows.values()).filter(
      (item) => recordIds.has(item.recordId),
    );

    const insights = Array.from(this.insights.values()).filter(
      (item) => recordIds.has(item.recordId),
    );

    return {
      system: "AVOS Industry Ultra Bundle 2-3",
      industry: industry ?? "ALL",
      records: records.length,
      activeRecords: records.filter((item) => item.status === "ACTIVE").length,
      workflows: workflows.length,
      runningWorkflows: workflows.filter((item) => item.status === "RUNNING")
        .length,
      completedWorkflows: workflows.filter(
        (item) => item.status === "COMPLETED",
      ).length,
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
    if (!record) {
      throw new Error(`Industry record not found: ${id}`);
    }
    return record;
  }

  private requireWorkflow(id: string) {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new Error(`Industry workflow not found: ${id}`);
    }
    return workflow;
  }

  private cloneRecord(record: UltraIndustryRecord): UltraIndustryRecord {
    return { ...record, metadata: { ...record.metadata } };
  }

  private cloneWorkflow(
    workflow: UltraIndustryWorkflow,
  ): UltraIndustryWorkflow {
    return { ...workflow, evidence: [...workflow.evidence] };
  }

  private cloneInsight(insight: UltraIndustryInsight): UltraIndustryInsight {
    return {
      ...insight,
      recommendations: [...insight.recommendations],
    };
  }
}