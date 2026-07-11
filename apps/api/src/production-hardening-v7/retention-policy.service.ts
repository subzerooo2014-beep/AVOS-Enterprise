import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { AssuranceStorageService } from "./assurance-storage.service";
import { CreateRetentionPolicyDto } from "./dto/create-retention-policy.dto";
import {
  RetentionPolicy,
} from "./types/production-hardening-v7.types";

@Injectable()
export class RetentionPolicyService {
  private readonly collection = "retention-policies";

  constructor(
    private readonly storage: AssuranceStorageService,
  ) {}

  async create(
    dto: CreateRetentionPolicyDto,
  ): Promise<RetentionPolicy> {
    const policies =
      await this.storage.readCollection<RetentionPolicy>(
        this.collection,
      );

    const duplicate = policies.find(
      (policy) =>
        policy.policyCode === dto.policyCode,
    );

    if (duplicate) {
      throw new Error(
        `Retention policy ${dto.policyCode} already exists`,
      );
    }

    this.validateRetentionSequence(dto);

    const now = new Date().toISOString();

    const policy: RetentionPolicy = {
      id: randomUUID(),
      policyCode: dto.policyCode,
      resourceType: dto.resourceType,
      retentionDays: dto.retentionDays,
      archiveAfterDays: dto.archiveAfterDays,
      purgeAfterDays: dto.purgeAfterDays,
      legalHoldSupported:
        dto.legalHoldSupported ?? true,
      enabled: dto.enabled ?? true,
      description: dto.description,
      createdAt: now,
      updatedAt: now,
    };

    policies.push(policy);

    await this.storage.writeCollection(
      this.collection,
      policies,
    );

    return policy;
  }

  async list(): Promise<RetentionPolicy[]> {
    const policies =
      await this.storage.readCollection<RetentionPolicy>(
        this.collection,
      );

    return policies.sort((a, b) =>
      a.policyCode.localeCompare(b.policyCode),
    );
  }

  async seedDefaults(): Promise<{
    created: number;
    total: number;
  }> {
    const existing = await this.list();

    const defaults: CreateRetentionPolicyDto[] = [
      {
        policyCode: "AVOS-RET-AUDIT-001",
        resourceType: "persistent-audit-ledger",
        retentionDays: 2555,
        archiveAfterDays: 365,
        purgeAfterDays: 2920,
        legalHoldSupported: true,
        enabled: true,
        description:
          "Seven-year online retention for enterprise audit evidence, followed by controlled purge eligibility.",
      },
      {
        policyCode: "AVOS-RET-EVIDENCE-001",
        resourceType: "security-evidence-package",
        retentionDays: 2555,
        archiveAfterDays: 730,
        purgeAfterDays: 3650,
        legalHoldSupported: true,
        enabled: true,
        description:
          "Long-term evidence-vault lifecycle with archive and legal-hold support.",
      },
      {
        policyCode: "AVOS-RET-COMPLIANCE-001",
        resourceType: "compliance-snapshot",
        retentionDays: 1825,
        archiveAfterDays: 365,
        purgeAfterDays: 2190,
        legalHoldSupported: true,
        enabled: true,
        description:
          "Five-year online retention for compliance snapshots.",
      },
      {
        policyCode: "AVOS-RET-ASSURANCE-001",
        resourceType: "continuous-assurance-report",
        retentionDays: 1095,
        archiveAfterDays: 365,
        purgeAfterDays: 1460,
        legalHoldSupported: true,
        enabled: true,
        description:
          "Three-year retention for continuous assurance reports.",
      },
    ];

    let created = 0;

    for (const dto of defaults) {
      if (
        existing.some(
          (policy) =>
            policy.policyCode === dto.policyCode,
        )
      ) {
        continue;
      }

      this.validateRetentionSequence(dto);

      const now = new Date().toISOString();

      existing.push({
        id: randomUUID(),
        policyCode: dto.policyCode,
        resourceType: dto.resourceType,
        retentionDays: dto.retentionDays,
        archiveAfterDays: dto.archiveAfterDays,
        purgeAfterDays: dto.purgeAfterDays,
        legalHoldSupported:
          dto.legalHoldSupported ?? true,
        enabled: dto.enabled ?? true,
        description: dto.description,
        createdAt: now,
        updatedAt: now,
      });

      created += 1;
    }

    await this.storage.writeCollection(
      this.collection,
      existing,
    );

    return {
      created,
      total: existing.length,
    };
  }

  private validateRetentionSequence(
    dto: CreateRetentionPolicyDto,
  ): void {
    if (
      dto.archiveAfterDays !== undefined &&
      dto.archiveAfterDays > dto.retentionDays
    ) {
      throw new Error(
        "archiveAfterDays cannot exceed retentionDays",
      );
    }

    if (
      dto.purgeAfterDays !== undefined &&
      dto.purgeAfterDays < dto.retentionDays
    ) {
      throw new Error(
        "purgeAfterDays cannot be less than retentionDays",
      );
    }
  }
}
