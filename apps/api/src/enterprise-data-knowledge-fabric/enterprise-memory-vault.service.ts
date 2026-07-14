import { Injectable } from '@nestjs/common';
import { MemoryVaultEntry } from './enterprise-data-knowledge-fabric.types';

@Injectable()
export class EnterpriseMemoryVaultService {
  private readonly entries = new Map<string, MemoryVaultEntry>();

  store(entry: MemoryVaultEntry): MemoryVaultEntry {
    this.entries.set(entry.id, { ...entry });
    return { ...entry };
  }

  list(): MemoryVaultEntry[] {
    return [...this.entries.values()].map((entry) => ({ ...entry }));
  }

  health() {
    const entries = this.list();
    const now = Date.now();
    const expired = entries.filter(
      (entry) =>
        entry.expiresAt &&
        new Date(entry.expiresAt).getTime() < now &&
        !entry.legalHold,
    );

    return {
      entries: entries.length,
      legalHolds: entries.filter((entry) => entry.legalHold).length,
      expiredEntries: expired.map((entry) => entry.id),
      healthScore: Math.round(
        Math.max(
          0,
          100 - (expired.length / Math.max(1, entries.length)) * 100,
        ),
      ),
    };
  }
}