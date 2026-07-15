import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { SPECIALIZED_INDUSTRY_REGISTRY } from "./industry-ultra-bundle-4-5.registry";
import {
  SpecializedCapability,
  SpecializedIndustryCode,
  SpecializedIndustryInsight,
  SpecializedIndustryMission,
  SpecializedIndustryRecord,
} from "./industry-ultra-bundle-4-5.types";

@Injectable()
export class IndustryUltraBundle45Service {
  private readonly records = new Map<string, SpecializedIndustryRecord>();
  private readonly missions = new Map<string, SpecializedIndustryMission>();
  private readonly insights = new Map<string, SpecializedIndustryInsight>();
  private readonly codes = new Set<string>();

  framework() {
    return {
      system: "AVOS Industry Ultra Bundle 4-5",
      status: "READY",
      industries: structuredClone(SPECIALIZED_INDUSTRY_REGISTRY),
      industryCount: Object.keys(SPECIALIZED_INDUSTRY_REGISTRY).length,
      totalCapabilities: Object.values(SPECIALIZED_INDUSTRY_REGISTRY).reduce(
        (sum, item) => sum + item.capabilities.length,
        0,
      ),
    };
  }

  createRecord(
    industry: SpecializedIndustryCode,
    capability: SpecializedCapability,
    input: Omit<
      SpecializedIndustryRecord,
      "id" | "industry" | "capability" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    const pack = SPECIALIZED_INDUSTRY_REGISTRY[industry];

    if (!pack) {
      throw new Error(`Unknown industry: ${industry}`);
    }

    if (!pack.capabilities.includes(capability)) {
      throw new Error(`Unsupported capability ${capability}`);
    }

    if (!input.name.trim() || !input.owner.trim()) {
      throw new Error("Name and owner are required");
    }

    const key = `${industry}:${capability}:${input.code.trim().toUpperCase()}`;

    if (this.codes.has(key)) {
      throw new Error(`Duplicate record code: ${key}`);
    }

    const now = new Date().toISOString();

    const record: SpecializedIndustryRecord = {
      ...input,
      id: randomUUID(),
      industry,
      capability,
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      owner: input.owner.trim(),
      status: "DRAFT",
      attributes: { ...input.attributes },
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);
    this.codes.add(key);

    return this.cloneRecord(record);
  }

  activateRecord(id: string) {
    const record = this.requireRecord(id);
    record.status = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    this.records.set(id, record);
    return this.cloneRecord(record);
  }

  createMission(
    recordId: string,
    input: Omit<
      SpecializedIndustryMission,
      "id" | "recordId" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    this.requireRecord(recordId);
    const now = new Date().toISOString();

    const mission: SpecializedIndustryMission = {
      ...input,
      id: randomUUID(),
      recordId,
      status: "PLANNED",
      evidence: [...input.evidence],
      createdAt: now,
      updatedAt: now,
    };

    this.missions.set(mission.id, mission);
    return this.cloneMission(mission);
  }

  startMission(id: string) {
    const mission = this.requireMission(id);
    mission.status = "RUNNING";
    mission.startedAt = new Date().toISOString();
    mission.updatedAt = mission.startedAt;
    this.missions.set(id, mission);
    return this.cloneMission(mission);
  }

  completeMission(id: string, evidence: string) {
    const mission = this.requireMission(id);

    if (mission.status !== "RUNNING") {
      throw new Error("Mission must be running before completion");
    }

    mission.status = "COMPLETED";
    mission.evidence.push(evidence);
    mission.completedAt = new Date().toISOString();
    mission.updatedAt = mission.completedAt;
    this.missions.set(id, mission);

    return this.cloneMission(mission);
  }

  createInsight(
    recordId: string,
    input: Omit<SpecializedIndustryInsight, "id" | "recordId" | "createdAt">,
  ) {
    this.requireRecord(recordId);

    if (input.score < 0 || input.score > 100) {
      throw new Error("Insight score must be between 0 and 100");
    }

    const insight: SpecializedIndustryInsight = {
      ...input,
      id: randomUUID(),
      recordId,
      actions: [...input.actions],
      createdAt: new Date().toISOString(),
    };

    this.insights.set(insight.id, insight);
    return this.cloneInsight(insight);
  }

  listRecords(
    industry?: SpecializedIndustryCode,
    capability?: SpecializedCapability,
    tenantId?: string,
  ) {
    return Array.from(this.records.values())
      .filter((item) => !industry || item.industry === industry)
      .filter((item) => !capability || item.capability === capability)
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .map((item) => this.cloneRecord(item));
  }

  commandCenter(industry?: SpecializedIndustryCode) {
    const records = Array.from(this.records.values()).filter(
      (item) => !industry || item.industry === industry,
    );

    const recordIds = new Set(records.map((item) => item.id));

    const missions = Array.from(this.missions.values()).filter(
      (item) => recordIds.has(item.recordId),
    );

    const insights = Array.from(this.insights.values()).filter(
      (item) => recordIds.has(item.recordId),
    );

    return {
      system: "AVOS Industry Ultra Bundle 4-5",
      industry: industry ?? "ALL",
      records: records.length,
      activeRecords: records.filter((item) => item.status === "ACTIVE").length,
      missions: missions.length,
      runningMissions: missions.filter((item) => item.status === "RUNNING")
        .length,
      completedMissions: missions.filter(
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
      throw new Error(`Record not found: ${id}`);
    }
    return record;
  }

  private requireMission(id: string) {
    const mission = this.missions.get(id);
    if (!mission) {
      throw new Error(`Mission not found: ${id}`);
    }
    return mission;
  }

  private cloneRecord(
    record: SpecializedIndustryRecord,
  ): SpecializedIndustryRecord {
    return { ...record, attributes: { ...record.attributes } };
  }

  private cloneMission(
    mission: SpecializedIndustryMission,
  ): SpecializedIndustryMission {
    return { ...mission, evidence: [...mission.evidence] };
  }

  private cloneInsight(
    insight: SpecializedIndustryInsight,
  ): SpecializedIndustryInsight {
    return { ...insight, actions: [...insight.actions] };
  }
}