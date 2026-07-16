import { Injectable } from "@nestjs/common";
import {
  DigitalDnaHistoryRecord,
  DigitalDnaRecord
} from "../foundation-pack-15.types";
import { DigitalDnaRegistryService } from "../dna/digital-dna-registry.service";
import { DigitalDnaAuditService } from "../observability/digital-dna-audit.service";

@Injectable()
export class DigitalDnaHistoryService {
  private readonly records:
    DigitalDnaHistoryRecord[] = [];

  constructor(
    private readonly registry: DigitalDnaRegistryService,
    private readonly audit: DigitalDnaAuditService
  ) {}

  list() {
    return [...this.records];
  }

  byDna(dnaId: string) {
    return this.records
      .filter((record) => record.dnaId === dnaId)
      .sort((left, right) =>
        left.occurredAt.localeCompare(right.occurredAt)
      );
  }

  snapshot(input: {
    dnaId: string;
    action: string;
    actorIdentityId: string;
    reason: string;
    previousVersion?: string;
    nextVersion?: string;
    correlationId: string;
  }) {
    const dna = this.registry.get(input.dnaId);

    const snapshot =
      JSON.parse(JSON.stringify(dna)) as DigitalDnaRecord;

    const record: DigitalDnaHistoryRecord = {
      id: `digital-dna-history:${Date.now()}:${
        this.records.length + 1
      }`,
      dnaId: dna.id,
      action: input.action,
      previousVersion: input.previousVersion,
      nextVersion: input.nextVersion,
      actorIdentityId: input.actorIdentityId,
      reason: input.reason,
      snapshot,
      occurredAt: new Date().toISOString()
    };

    this.records.push(record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "history",
      action: "digital-dna-history-recorded",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        dnaId: dna.id,
        action: input.action
      }
    });

    return record;
  }

  summary() {
    return {
      total: this.records.length,
      dnaAssetsTracked: new Set(
        this.records.map((record) => record.dnaId)
      ).size
    };
  }
}
