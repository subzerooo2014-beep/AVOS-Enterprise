import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { GRAND_BUSINESS_DOMAINS } from "./grand-business-product.registry";
import {
  ProductCommandRequest,
  ProductCommandResult,
  ProductRecord,
} from "./grand-business-product.types";

@Injectable()
export class GrandBusinessProductService {
  private readonly records = new Map<string, ProductRecord>();
  private readonly executions = new Map<string, ProductCommandResult>();

  domains() {
    return GRAND_BUSINESS_DOMAINS.map((domain) => ({
      ...domain,
      capabilities: [...domain.capabilities],
      status: domain.enabled ? "READY" : "DISABLED",
    }));
  }

  domain(key: string) {
    const domain = GRAND_BUSINESS_DOMAINS.find((item) => item.key === key);

    if (!domain) {
      throw new Error(`Product domain not found: ${key}`);
    }

    return {
      ...domain,
      capabilities: [...domain.capabilities],
      status: domain.enabled ? "READY" : "DISABLED",
    };
  }

  createRecord(
    input: Omit<ProductRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ): ProductRecord {
    this.requireDomain(input.domain);

    if (!input.tenantId?.trim() || !input.actorId?.trim()) {
      throw new Error("tenantId and actorId are required");
    }

    const now = new Date().toISOString();
    const record: ProductRecord = {
      ...input,
      id: randomUUID(),
      status: "DRAFT",
      payload: { ...input.payload },
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);
    return this.cloneRecord(record);
  }

  activateRecord(id: string): ProductRecord {
    const record = this.requireRecord(id);
    record.status = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    this.records.set(id, record);
    return this.cloneRecord(record);
  }

  completeRecord(id: string): ProductRecord {
    const record = this.requireRecord(id);
    record.status = "COMPLETED";
    record.updatedAt = new Date().toISOString();
    this.records.set(id, record);
    return this.cloneRecord(record);
  }

  recordsForDomain(domain: string): ProductRecord[] {
    this.requireDomain(domain);

    return Array.from(this.records.values())
      .filter((record) => record.domain === domain)
      .map((record) => this.cloneRecord(record));
  }

  execute(request: ProductCommandRequest): ProductCommandResult {
    const domain = this.requireDomain(request.domain);

    if (!domain.capabilities.includes(request.capability)) {
      throw new Error(
        `Capability ${request.capability} is not available in ${request.domain}`,
      );
    }

    if (
      !request.tenantId?.trim() ||
      !request.actorId?.trim() ||
      !request.action?.trim()
    ) {
      throw new Error("tenantId, actorId and action are required");
    }

    const result: ProductCommandResult = {
      id: randomUUID(),
      domain: request.domain,
      capability: request.capability,
      action: request.action,
      tenantId: request.tenantId,
      actorId: request.actorId,
      status: "COMPLETED",
      success: true,
      createdAt: new Date().toISOString(),
      output: {
        payload: request.payload ?? {},
        governed: true,
        auditable: true,
        observable: true,
        productRuntime: true,
      },
    };

    this.executions.set(result.id, result);
    return { ...result, output: { ...result.output } };
  }

  dashboard() {
    const records = Array.from(this.records.values());

    return {
      system: "AVOS Grand Business Product",
      domains: GRAND_BUSINESS_DOMAINS.length,
      capabilities: GRAND_BUSINESS_DOMAINS.reduce(
        (sum, domain) => sum + domain.capabilities.length,
        0,
      ),
      records: records.length,
      activeRecords: records.filter((record) => record.status === "ACTIVE")
        .length,
      completedRecords: records.filter(
        (record) => record.status === "COMPLETED",
      ).length,
      executions: this.executions.size,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireDomain(key: string) {
    const domain = GRAND_BUSINESS_DOMAINS.find((item) => item.key === key);

    if (!domain || !domain.enabled) {
      throw new Error(`Active product domain not found: ${key}`);
    }

    return domain;
  }

  private requireRecord(id: string): ProductRecord {
    const record = this.records.get(id);

    if (!record) {
      throw new Error(`Product record not found: ${id}`);
    }

    return record;
  }

  private cloneRecord(record: ProductRecord): ProductRecord {
    return {
      ...record,
      payload: { ...record.payload },
    };
  }
}