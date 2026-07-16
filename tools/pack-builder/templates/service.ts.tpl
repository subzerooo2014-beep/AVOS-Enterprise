import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { {{REGISTRY_NAME}} } from "./{{MODULE_SLUG}}.registry";
import {
  {{RECORD_NAME}},
  {{TYPE_NAME}},
} from "./{{MODULE_SLUG}}.types";

@Injectable()
export class {{SERVICE_NAME}} {
  private readonly records = new Map<string, {{RECORD_NAME}}>();

  framework() {
    return {
      system: "{{TITLE}}",
      version: "1.0.0",
      status: "READY",
      capabilityCount: Object.keys({{REGISTRY_NAME}}).length,
      capabilities: structuredClone({{REGISTRY_NAME}}),
    };
  }

  createRecord(
    input: Omit<{{RECORD_NAME}}, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    if (!{{REGISTRY_NAME}}[input.capability]) {
      throw new Error(`Unknown capability: ${input.capability}`);
    }

    if (input.score < 0 || input.score > 100) {
      throw new Error("Score must be between 0 and 100");
    }

    const now = new Date().toISOString();
    const record: {{RECORD_NAME}} = {
      ...input,
      id: randomUUID(),
      status: "DRAFT",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);
    return this.clone(record);
  }

  activateRecord(id: string) {
    const record = this.requireRecord(id);
    record.status = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    this.records.set(id, record);
    return this.clone(record);
  }

  completeRecord(id: string) {
    const record = this.requireRecord(id);

    if (record.status !== "ACTIVE") {
      throw new Error("Record must be active before completion");
    }

    record.status = "COMPLETED";
    record.updatedAt = new Date().toISOString();
    this.records.set(id, record);
    return this.clone(record);
  }

  listRecords(tenantId?: string) {
    return Array.from(this.records.values())
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .map((item) => this.clone(item));
  }

  commandCenter(tenantId?: string) {
    const records = Array.from(this.records.values()).filter(
      (item) => !tenantId || item.tenantId === tenantId,
    );

    return {
      system: "{{TITLE}}",
      tenantId: tenantId ?? "ALL",
      records: records.length,
      active: records.filter((item) => item.status === "ACTIVE").length,
      completed: records.filter((item) => item.status === "COMPLETED").length,
      failed: records.filter((item) => item.status === "FAILED").length,
      averageScore:
        records.length === 0
          ? 0
          : Number(
              (
                records.reduce((sum, item) => sum + item.score, 0) /
                records.length
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

  private clone(record: {{RECORD_NAME}}): {{RECORD_NAME}} {
    return {
      ...record,
      metadata: { ...record.metadata },
    };
  }
}