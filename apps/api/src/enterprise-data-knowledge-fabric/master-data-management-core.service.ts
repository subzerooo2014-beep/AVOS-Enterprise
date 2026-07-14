import { Injectable } from '@nestjs/common';
import { MasterRecord } from './enterprise-data-knowledge-fabric.types';

@Injectable()
export class MasterDataManagementCoreService {
  resolve(records: MasterRecord[]) {
    const grouped = new Map<string, MasterRecord[]>();

    for (const record of records) {
      const key = `${record.entity}:${record.id}`;
      const existing = grouped.get(key) ?? [];
      existing.push(record);
      grouped.set(key, existing);
    }

    const goldenRecords = [...grouped.entries()].map(([key, candidates]) => {
      const winner = [...candidates].sort(
        (left, right) =>
          right.confidence - left.confidence ||
          right.version - left.version,
      )[0];

      return {
        key,
        winner,
        candidates: candidates.length,
        sourceSystems: [
          ...new Set(candidates.map((candidate) => candidate.sourceSystem)),
        ],
      };
    });

    return {
      goldenRecords,
      entityCount: goldenRecords.length,
      conflictCount: goldenRecords.filter(
        (record) => record.candidates > 1,
      ).length,
    };
  }
}