import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CapabilityAuditEntry } from "./capability-enterprise.types";

@Injectable()
export class CapabilityAuditService {
  private readonly entries: CapabilityAuditEntry[] = [];

  record(input: Omit<CapabilityAuditEntry, "id" | "occurredAt">) {
    const entry: CapabilityAuditEntry = {
      id: randomUUID(),
      occurredAt: new Date().toISOString(),
      ...structuredClone(input),
    };

    this.entries.push(entry);
    return structuredClone(entry);
  }

  list(capabilityKey?: string) {
    return this.entries
      .filter((entry) =>
        capabilityKey
          ? entry.capabilityKey === capabilityKey.toLowerCase()
          : true,
      )
      .map((entry) => structuredClone(entry));
  }

  count() {
    return this.entries.length;
  }
}