import { Injectable } from "@nestjs/common";
import {
  DigitalDnaEvolutionRecord,
  DigitalDnaRecord
} from "../foundation-pack-15.types";
import { DigitalDnaRegistryService } from "../dna/digital-dna-registry.service";
import { DigitalDnaHistoryService } from "../history/digital-dna-history.service";
import { DigitalDnaAuditService } from "../observability/digital-dna-audit.service";

@Injectable()
export class DigitalDnaEvolutionService {
  private readonly records =
    new Map<string, DigitalDnaEvolutionRecord>();

  constructor(
    private readonly registry: DigitalDnaRegistryService,
    private readonly history: DigitalDnaHistoryService,
    private readonly audit: DigitalDnaAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  evolve(input: {
    dnaId: string;
    toVersion: string;
    changeSummary: string;
    changedSections: string[];
    compatibility:
      | "compatible"
      | "conditionally-compatible"
      | "breaking";
    approvedByIdentityId?: string;
    evolvedByIdentityId: string;
    correlationId: string;
    patch: {
      purpose?: DigitalDnaRecord["purpose"];
      contracts?: DigitalDnaRecord["contracts"];
      dependencies?: DigitalDnaRecord["dependencies"];
      policies?: DigitalDnaRecord["policies"];
      permissions?: DigitalDnaRecord["permissions"];
      events?: string[];
      metrics?: DigitalDnaRecord["metrics"];
      metadata?: Record<string, unknown>;
    };
  }) {
    const current = this.registry.get(input.dnaId);

    if (
      input.compatibility === "breaking" &&
      !input.approvedByIdentityId
    ) {
      throw new Error(
        "Breaking DNA evolution requires explicit human approval."
      );
    }

    this.history.snapshot({
      dnaId: current.id,
      action: "before-evolution",
      actorIdentityId: input.evolvedByIdentityId,
      reason: input.changeSummary,
      previousVersion: current.version,
      nextVersion: input.toVersion,
      correlationId: input.correlationId
    });

    const updated = this.registry.update(
      current.id,
      {
        ...input.patch,
        version: input.toVersion,
        status: "active"
      },
      {
        actorIdentityId: input.evolvedByIdentityId,
        correlationId: input.correlationId
      }
    );

    const record: DigitalDnaEvolutionRecord = {
      id: `digital-dna-evolution:${Date.now()}:${
        this.records.size + 1
      }`,
      dnaId: current.id,
      fromVersion: current.version,
      toVersion: input.toVersion,
      changeSummary: input.changeSummary,
      changedSections: Array.from(
        new Set(input.changedSections)
      ),
      compatibility: input.compatibility,
      approvedByIdentityId:
        input.approvedByIdentityId,
      evolvedByIdentityId:
        input.evolvedByIdentityId,
      evolvedAt: new Date().toISOString()
    };

    this.records.set(record.id, record);

    this.history.snapshot({
      dnaId: updated.id,
      action: "after-evolution",
      actorIdentityId: input.evolvedByIdentityId,
      reason: input.changeSummary,
      previousVersion: current.version,
      nextVersion: updated.version,
      correlationId: input.correlationId
    });

    this.audit.record({
      correlationId: input.correlationId,
      category: "evolution",
      action: "digital-dna-evolved",
      subjectId: record.id,
      actorIdentityId: input.evolvedByIdentityId,
      outcome:
        input.compatibility === "breaking"
          ? "warning"
          : "success",
      metadata: {
        dnaId: current.id,
        fromVersion: current.version,
        toVersion: input.toVersion,
        compatibility: input.compatibility
      }
    });

    return {
      evolution: record,
      dna: updated
    };
  }

  summary() {
    const records = this.list();

    return {
      total: records.length,
      compatible: records.filter(
        (record) =>
          record.compatibility === "compatible"
      ).length,
      conditional: records.filter(
        (record) =>
          record.compatibility ===
          "conditionally-compatible"
      ).length,
      breaking: records.filter(
        (record) =>
          record.compatibility === "breaking"
      ).length
    };
  }
}
