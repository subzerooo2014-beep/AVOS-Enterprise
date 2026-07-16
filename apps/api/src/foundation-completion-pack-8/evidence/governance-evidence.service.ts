import { Injectable, NotFoundException } from "@nestjs/common";
import {
  GovernanceEvidenceRecord,
  GovernanceScope
} from "../foundation-pack-8.types";
import { GovernanceAuditService } from "../observability/governance-audit.service";

@Injectable()
export class GovernanceEvidenceService {
  private readonly records =
    new Map<string, GovernanceEvidenceRecord>();

  constructor(
    private readonly audit: GovernanceAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  get(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(
        `Governance evidence not found: ${id}`
      );
    }

    return record;
  }

  create(input: {
    subjectId: string;
    subjectType: GovernanceScope;
    controlId?: string;
    policyId?: string;
    evidenceType: GovernanceEvidenceRecord["evidenceType"];
    referenceId: string;
    description: string;
    correlationId: string;
    actorIdentityId: string;
  }) {
    const record: GovernanceEvidenceRecord = {
      id: `governance-evidence:${Date.now()}:${
        this.records.size + 1
      }`,
      subjectId: input.subjectId,
      subjectType: input.subjectType,
      controlId: input.controlId,
      policyId: input.policyId,
      evidenceType: input.evidenceType,
      referenceId: input.referenceId,
      description: input.description,
      verified: false,
      createdAt: new Date().toISOString()
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "evidence",
      action: "evidence-created",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        referenceId: record.referenceId,
        evidenceType: record.evidenceType
      }
    });

    return record;
  }

  verify(
    id: string,
    input: {
      verifiedByIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    const updated: GovernanceEvidenceRecord = {
      ...current,
      verified: true,
      verifiedByIdentityId: input.verifiedByIdentityId,
      verifiedAt: new Date().toISOString()
    };

    this.records.set(id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "evidence",
      action: "evidence-verified",
      subjectId: id,
      actorIdentityId: input.verifiedByIdentityId,
      outcome: "success",
      metadata: {}
    });

    return updated;
  }

  bySubject(subjectId: string) {
    return this.list().filter(
      (record) => record.subjectId === subjectId
    );
  }

  byControl(controlId: string) {
    return this.list().filter(
      (record) => record.controlId === controlId
    );
  }

  summary() {
    const records = this.list();

    return {
      total: records.length,
      verified: records.filter((item) => item.verified).length,
      unverified: records.filter((item) => !item.verified).length
    };
  }
}
