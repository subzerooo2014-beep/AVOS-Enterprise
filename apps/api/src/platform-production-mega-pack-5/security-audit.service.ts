import { Injectable } from "@nestjs/common";
import { SecurityAuditRecord } from "./platform-production-mega-pack-5.types";
import { PlatformSecurityFileStoreService } from "./platform-security-file-store.service";

@Injectable()
export class SecurityAuditService {
  constructor(
    private readonly store: PlatformSecurityFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  record(input: Omit<SecurityAuditRecord, "id" | "createdAt">): SecurityAuditRecord {
    const record: SecurityAuditRecord = {
      ...input,
      id: this.id("security-audit"),
      createdAt: this.now(),
    };

    this.store.writeJson(`audit/${record.id}.json`, record);
    return record;
  }

  list(): SecurityAuditRecord[] {
    return this.store.listJson<SecurityAuditRecord>("audit");
  }
}