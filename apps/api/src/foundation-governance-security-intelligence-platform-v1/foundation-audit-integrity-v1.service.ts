import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";
import type { FoundationAuditRecordV1 } from "./foundation-governance-security-intelligence-v1.types";

@Injectable()
export class FoundationAuditIntegrityV1Service {
  private readonly records: FoundationAuditRecordV1[] = [];

  record(
    actor: string,
    action: string,
    resource: string,
    payload: Record<string, unknown>,
  ): FoundationAuditRecordV1 {
    const previousHash = this.records[0]?.integrityHash;
    const payloadHash = createHash("sha256")
      .update(JSON.stringify(payload))
      .digest("hex");

    const integrityHash = createHash("sha256")
      .update(
        [actor, action, resource, payloadHash, previousHash ?? ""].join("|"),
      )
      .digest("hex");

    const record: FoundationAuditRecordV1 = {
      id: `foundation-audit-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      actor,
      action,
      resource,
      payloadHash,
      previousHash,
      integrityHash,
      createdAt: new Date().toISOString(),
    };

    this.records.unshift(record);
    return { ...record };
  }

  verifyChain(): boolean {
    for (let index = 0; index < this.records.length - 1; index += 1) {
      if (this.records[index].previousHash !== this.records[index + 1].integrityHash) {
        return false;
      }
    }

    return true;
  }

  list(): FoundationAuditRecordV1[] {
    return this.records.map((item) => ({ ...item }));
  }

  count(): number {
    return this.records.length;
  }
}
