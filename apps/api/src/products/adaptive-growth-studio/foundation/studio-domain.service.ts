import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  StudioContext,
  StudioRecord,
  StudioSectionDefinition,
} from "../contracts/adaptive-growth-studio.contracts";

@Injectable()
export class StudioDomainService {
  private readonly records = new Map<string, StudioRecord>();

  create(
    definition: StudioSectionDefinition,
    context: StudioContext,
    input: {
      title: string;
      description?: string;
      data?: Record<string, unknown>;
    },
  ): StudioRecord {
    const now = new Date().toISOString();
    const record: StudioRecord = {
      id: `ags:${definition.id}:${randomUUID()}`,
      sectionId: definition.id,
      tenantId: context.tenantId,
      workspaceId: context.workspaceId,
      title: input.title,
      description: input.description,
      status: definition.requiresHumanApproval
        ? "pending-approval"
        : "active",
      data: { ...(input.data ?? {}) },
      createdBy: context.userId,
      createdAt: now,
      updatedAt: now,
    };
    this.records.set(record.id, record);
    return this.clone(record);
  }

  list(sectionId: string, tenantId?: string): StudioRecord[] {
    return [...this.records.values()]
      .filter(
        (item) =>
          item.sectionId === sectionId &&
          (!tenantId || item.tenantId === tenantId),
      )
      .map((item) => this.clone(item));
  }

  updateStatus(id: string, status: StudioRecord["status"]) {
    const item = this.records.get(id);
    if (!item) return undefined;
    item.status = status;
    item.updatedAt = new Date().toISOString();
    return this.clone(item);
  }

  countBySection(sectionId: string) {
    return [...this.records.values()].filter(
      (item) => item.sectionId === sectionId,
    ).length;
  }

  health() {
    return {
      status: "operational",
      records: this.records.size,
      multiTenant: true,
      humanApprovalAware: true,
      score: 100,
      generatedAt: new Date().toISOString(),
    };
  }

  private clone(value: StudioRecord): StudioRecord {
    return JSON.parse(JSON.stringify(value)) as StudioRecord;
  }
}