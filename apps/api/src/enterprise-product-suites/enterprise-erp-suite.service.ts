import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ErpRecord } from "./enterprise-product-suites.types";

@Injectable()
export class EnterpriseErpSuiteService {
  private readonly records = new Map<string, ErpRecord>();

  create(
    input: Omit<ErpRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ): ErpRecord {
    const now = new Date().toISOString();

    const record: ErpRecord = {
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

  activate(id: string): ErpRecord {
    const record = this.requireRecord(id);
    record.status = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    this.records.set(id, record);
    return this.clone(record);
  }

  complete(id: string): ErpRecord {
    const record = this.requireRecord(id);
    record.status = "COMPLETED";
    record.updatedAt = new Date().toISOString();
    this.records.set(id, record);
    return this.clone(record);
  }

  dashboard() {
    const records = Array.from(this.records.values());

    return {
      records: records.length,
      finance: records.filter((item) => item.domain === "FINANCE").length,
      procurement: records.filter((item) => item.domain === "PROCUREMENT").length,
      inventory: records.filter((item) => item.domain === "INVENTORY").length,
      warehouse: records.filter((item) => item.domain === "WAREHOUSE").length,
      hr: records.filter((item) => item.domain === "HR").length,
      projects: records.filter((item) => item.domain === "PROJECTS").length,
      completed: records.filter((item) => item.status === "COMPLETED").length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireRecord(id: string): ErpRecord {
    const record = this.records.get(id);
    if (!record) {
      throw new Error(`ERP record not found: ${id}`);
    }
    return record;
  }

  private clone(record: ErpRecord): ErpRecord {
    return {
      ...record,
      metadata: { ...record.metadata },
    };
  }
}