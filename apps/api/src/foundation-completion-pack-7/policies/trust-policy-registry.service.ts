import { Injectable, NotFoundException } from "@nestjs/common";
import { TrustPolicy } from "../foundation-pack-7.types";
import { TrustAuditLedgerService } from "../audit/trust-audit-ledger.service";

@Injectable()
export class TrustPolicyRegistryService {
  private readonly policies = new Map<string, TrustPolicy>([
    [
      "trust-policy:default-decision",
      {
        id: "trust-policy:default-decision",
        name: "Default Decision Trust Policy",
        description:
          "Baseline trust requirements for governed AVOS decisions.",
        active: true,
        minimumEvidenceCount: 1,
        minimumVerifiedEvidenceCount: 0,
        minimumAverageEvidenceReliability: 60,
        maximumRiskScore: 70,
        requireProvenance: true,
        requireExplainability: true,
        requireHumanApprovalAboveRisk: 60,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    [
      "trust-policy:high-impact-decision",
      {
        id: "trust-policy:high-impact-decision",
        name: "High Impact Decision Trust Policy",
        description:
          "Strict trust controls for high-impact autonomous decisions.",
        active: true,
        minimumEvidenceCount: 2,
        minimumVerifiedEvidenceCount: 1,
        minimumAverageEvidenceReliability: 75,
        maximumRiskScore: 50,
        requireProvenance: true,
        requireExplainability: true,
        requireHumanApprovalAboveRisk: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  ]);

  constructor(
    private readonly audit: TrustAuditLedgerService
  ) {}

  list() {
    return Array.from(this.policies.values());
  }

  get(id: string) {
    const policy = this.policies.get(id);

    if (!policy) {
      throw new NotFoundException(`Trust policy not found: ${id}`);
    }

    return policy;
  }

  create(
    input: Omit<TrustPolicy, "createdAt" | "updatedAt">,
    context: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    const now = new Date().toISOString();
    const policy: TrustPolicy = {
      ...input,
      minimumEvidenceCount: Math.max(
        0,
        Math.round(input.minimumEvidenceCount)
      ),
      minimumVerifiedEvidenceCount: Math.max(
        0,
        Math.round(input.minimumVerifiedEvidenceCount)
      ),
      minimumAverageEvidenceReliability: this.clamp(
        input.minimumAverageEvidenceReliability
      ),
      maximumRiskScore: this.clamp(input.maximumRiskScore),
      requireHumanApprovalAboveRisk: this.clamp(
        input.requireHumanApprovalAboveRisk
      ),
      createdAt: now,
      updatedAt: now
    };

    this.policies.set(policy.id, policy);

    this.audit.record({
      correlationId: context.correlationId,
      category: "policy",
      action: "trust-policy-created",
      subjectId: policy.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      after: {
        active: policy.active,
        maximumRiskScore: policy.maximumRiskScore,
        requireProvenance: policy.requireProvenance
      },
      metadata: {}
    });

    return policy;
  }

  summary() {
    const policies = this.list();

    return {
      total: policies.length,
      active: policies.filter((policy) => policy.active).length,
      strict: policies.filter(
        (policy) => policy.maximumRiskScore <= 50
      ).length
    };
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Number(value.toFixed(2))));
  }
}
