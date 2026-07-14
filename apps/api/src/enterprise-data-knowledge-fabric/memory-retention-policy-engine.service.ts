import { Injectable } from '@nestjs/common';
import { MemoryVaultEntry } from './enterprise-data-knowledge-fabric.types';

@Injectable()
export class MemoryRetentionPolicyEngineService {
  evaluate(entries: MemoryVaultEntry[]) {
    const now = Date.now();

    return entries.map((entry) => {
      const expired =
        Boolean(entry.expiresAt) &&
        new Date(entry.expiresAt as string).getTime() < now;

      return {
        ...entry,
        action: entry.legalHold
          ? 'retain'
          : expired
            ? 'purge'
            : entry.importance >= 80
              ? 'archive'
              : 'retain',
      };
    });
  }
}