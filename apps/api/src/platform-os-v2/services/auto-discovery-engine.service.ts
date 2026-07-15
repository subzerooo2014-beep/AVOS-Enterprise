import { Injectable } from '@nestjs/common';
import {
  PlatformComponentRecord,
  PlatformOperationResult,
} from '../platform-os-v2.types';

@Injectable()
export class AutoDiscoveryEngineService {
  private readonly records = new Map<string, PlatformComponentRecord>();

  register(record: PlatformComponentRecord): PlatformComponentRecord {
    const stored = {
      ...record,
      capability: 'auto-discovery-engine' as const,
      status: record.enabled ? ('active' as const) : ('registered' as const),
    };

    this.records.set(stored.id, stored);
    return { ...stored };
  }

  execute(
    action: string,
    payload: Record<string, unknown> = {},
  ): PlatformOperationResult {
    const active = [...this.records.values()].filter(
      (record) => record.enabled && record.status === 'active',
    ).length;

    const score = Math.min(
      100,
      Math.round(80 + Math.min(20, active * 2)),
    );

    return {
      capability: 'auto-discovery-engine',
      success: true,
      score,
      status: action,
      timestamp: new Date().toISOString(),
      details: {
        action,
        payload,
        activeRecords: active,
        registeredRecords: this.records.size,
      },
    };
  }

  list(): PlatformComponentRecord[] {
    return [...this.records.values()].map((record) => ({
      ...record,
      metadata: { ...record.metadata },
    }));
  }

  health() {
    return {
      capability: 'auto-discovery-engine',
      registered: this.records.size,
      active: [...this.records.values()].filter(
        (record) => record.status === 'active',
      ).length,
      healthy: true,
    };
  }
}