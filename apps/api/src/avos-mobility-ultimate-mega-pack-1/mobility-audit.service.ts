import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { MobilityPersistenceService } from './mobility-persistence.service';

@Injectable()
export class MobilityAuditService {
  constructor(private readonly persistence: MobilityPersistenceService) {}

  async record(action: string, entityType: string, entityId: string, details?: unknown) {
    const store = await this.persistence.read();
    const entry = {
      id: randomUUID(),
      action,
      entityType,
      entityId,
      details,
      actor: 'system:mobility-api',
      timestamp: new Date().toISOString(),
    };
    store.audit.push(entry);
    await this.persistence.write(store);
    return entry;
  }

  async list(limit = 100) {
    const store = await this.persistence.read();
    return [...store.audit].reverse().slice(0, Math.max(1, Math.min(limit, 500)));
  }
}