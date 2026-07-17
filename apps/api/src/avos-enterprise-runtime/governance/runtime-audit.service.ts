import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { createRuntimeId, nowIso } from '../shared/runtime.utils';

export interface RuntimeAuditEntry {
  id: string;
  action: string;
  actor: string;
  subject: string;
  timestamp: string;
  payload: Record<string, unknown>;
  previousHash?: string;
  hash: string;
}

@Injectable()
export class RuntimeAuditService {
  private readonly entries: RuntimeAuditEntry[] = [];

  record(input: Omit<RuntimeAuditEntry, 'id' | 'timestamp' | 'hash' | 'previousHash'>): RuntimeAuditEntry {
    const previousHash = this.entries[this.entries.length - 1]?.hash;
    const base = {
      id: createRuntimeId('audit'),
      timestamp: nowIso(),
      previousHash,
      ...input,
    };

    const hash = createHash('sha256')
      .update(JSON.stringify(base))
      .digest('hex');

    const entry: RuntimeAuditEntry = {
      ...base,
      hash,
    };

    this.entries.push(entry);
    return structuredClone(entry);
  }

  list(): RuntimeAuditEntry[] {
    return this.entries.map((entry) => structuredClone(entry));
  }

  verifyChain(): boolean {
    let previousHash: string | undefined;

    for (const entry of this.entries) {
      if (entry.previousHash !== previousHash) return false;

      const { hash, ...base } = entry;
      const recalculated = createHash('sha256')
        .update(JSON.stringify(base))
        .digest('hex');

      if (hash !== recalculated) return false;
      previousHash = hash;
    }

    return true;
  }

  count(): number {
    return this.entries.length;
  }
}