import { Injectable } from '@nestjs/common';
import { SyncRecord } from './enterprise-integration-federation.types';

@Injectable()
export class CrossPlatformSynchronizationEngineService {
  analyze(records: SyncRecord[]) {
    const results = records.map((record) => {
      const versionGap = record.sourceVersion - record.targetVersion;
      return {
        ...record,
        versionGap,
        synchronized: versionGap === 0,
        action:
          versionGap === 0
            ? 'none'
            : versionGap > 0
              ? 'push-source-to-target'
              : 'pull-target-to-source',
      };
    });

    return {
      results,
      synchronizedCount: results.filter((record) => record.synchronized).length,
      pendingCount: results.filter((record) => !record.synchronized).length,
      synchronizationScore: Math.round(
        (results.filter((record) => record.synchronized).length /
          Math.max(1, results.length)) *
          100,
      ),
    };
  }
}