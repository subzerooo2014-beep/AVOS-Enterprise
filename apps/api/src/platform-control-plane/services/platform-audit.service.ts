import { Injectable } from "@nestjs/common";
import type { PlatformAuditRecord } from "../contracts/platform-control-plane.contracts";
import { PlatformIdService } from "./platform-id.service";

@Injectable()
export class PlatformAuditService {
  private readonly records: PlatformAuditRecord[] = [];

  constructor(private readonly ids: PlatformIdService) {}

  record(input: Omit<PlatformAuditRecord, "id" | "createdAt">): PlatformAuditRecord {
    const record: PlatformAuditRecord = {
      ...input,
      id: this.ids.create(),
      createdAt: this.ids.now()
    };

    this.records.push(record);
    return record;
  }

  list(limit = 100): PlatformAuditRecord[] {
    return this.records.slice().reverse().slice(0, Math.max(1, limit));
  }

  count(): number {
    return this.records.length;
  }
}