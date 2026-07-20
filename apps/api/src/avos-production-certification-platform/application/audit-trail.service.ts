import { Injectable } from '@nestjs/common';

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  platformId: string;
  occurredAt: string;
  metadata: Record<string, unknown>;
}

@Injectable()
export class AuditTrailService {
  private readonly entries: AuditEntry[] = [];

  record(
    action: string,
    actor: string,
    platformId: string,
    metadata: Record<string, unknown> = {},
  ): AuditEntry {
    const entry: AuditEntry = {
      id: 'audit-' + Date.now().toString(),
      action,
      actor,
      platformId,
      occurredAt: new Date().toISOString(),
      metadata,
    };

    this.entries.push(entry);
    return entry;
  }

  list(platformId?: string): AuditEntry[] {
    return platformId
      ? this.entries.filter((entry) => entry.platformId === platformId)
      : [...this.entries];
  }
}
