import { Injectable } from "@nestjs/common";
import { DigitalIdentityRecord, IdentityPolicyEvaluation } from "../contracts/digital-identity.contracts";
import { EvaluateIdentityPolicyDto, MergeIdentityDto, VerifyIdentityDto } from "../dto/digital-identity.dto";
import { IdentityAuditService } from "./identity-audit.service";
import { IdentityRegistryService } from "./identity-registry.service";

@Injectable()
export class IdentityGovernanceService {
  private readonly evaluations: IdentityPolicyEvaluation[] = [];

  constructor(private readonly registry: IdentityRegistryService, private readonly audit: IdentityAuditService) {}

  verify(dto: VerifyIdentityDto): DigitalIdentityRecord {
    const current = this.registry.get(dto.identityId);
    const approved = dto.approved;
    const record: DigitalIdentityRecord = {
      ...current,
      verificationStatus: approved ? "verified" : "rejected",
      trustLevel: approved ? "trusted" : "unknown",
      trustScore: approved ? Math.max(current.trustScore, 80) : Math.min(current.trustScore, 10),
      version: current.version + 1,
      dna: { ...current.dna, provenance: [...current.dna.provenance, ...(dto.evidence ?? [])], evolutionHistory: [...current.dna.evolutionHistory, `Verification ${approved ? "approved" : "rejected"} at ${new Date().toISOString()}`] },
      updatedAt: new Date().toISOString(),
    };
    this.registry.save(record);
    this.audit.record({ identityId: current.id, action: "identity.verify", actor: dto.actor ?? "human-authority", outcome: approved ? "allowed" : "denied", details: { evidence: dto.evidence ?? [] } });
    return record;
  }

  evaluate(dto: EvaluateIdentityPolicyDto): IdentityPolicyEvaluation {
    const identity = this.registry.get(dto.identityId);
    const highRiskAction = /(delete|merge|retire|privilege|admin|payment|certify)/i.test(dto.action);
    const approved = identity.status === "active" && identity.verificationStatus !== "rejected";
    const evaluation: IdentityPolicyEvaluation = {
      id: `identity-policy:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      identityId: identity.id,
      action: dto.action,
      approved,
      requiresHumanApproval: highRiskAction || identity.kind === "agent" || identity.kind === "machine",
      reasons: [approved ? "Identity is operational." : "Identity is not eligible for this action.", highRiskAction ? "High-impact action requires human authority." : "Standard governed action."],
      evaluatedAt: new Date().toISOString(),
    };
    this.evaluations.unshift(evaluation);
    this.audit.record({ identityId: identity.id, action: "identity.policy.evaluate", actor: dto.actor ?? "system", outcome: approved ? "allowed" : "denied", details: { requestedAction: dto.action, requiresHumanApproval: evaluation.requiresHumanApproval } });
    return evaluation;
  }

  merge(dto: MergeIdentityDto): { readonly primary: DigitalIdentityRecord; readonly duplicate: DigitalIdentityRecord } {
    const primary = this.registry.get(dto.primaryIdentityId);
    const duplicate = this.registry.get(dto.duplicateIdentityId);
    const now = new Date().toISOString();
    const mergedPrimary: DigitalIdentityRecord = {
      ...primary,
      tags: [...new Set([...primary.tags, ...duplicate.tags])],
      metadata: { ...duplicate.metadata, ...primary.metadata },
      trustScore: Math.max(primary.trustScore, duplicate.trustScore),
      version: primary.version + 1,
      dna: {
        purpose: primary.dna.purpose,
        capabilities: [...new Set([...primary.dna.capabilities, ...duplicate.dna.capabilities])],
        policies: [...new Set([...primary.dna.policies, ...duplicate.dna.policies])],
        permissions: [...new Set([...primary.dna.permissions, ...duplicate.dna.permissions])],
        dependencies: [...new Set([...primary.dna.dependencies, ...duplicate.dna.dependencies])],
        contracts: [...new Set([...primary.dna.contracts, ...duplicate.dna.contracts])],
        provenance: [...new Set([...primary.dna.provenance, ...duplicate.dna.provenance])],
        evolutionHistory: [...primary.dna.evolutionHistory, `Merged identity ${duplicate.id} at ${now}`],
      },
      updatedAt: now,
    };
    const mergedDuplicate: DigitalIdentityRecord = { ...duplicate, status: "merged", version: duplicate.version + 1, updatedAt: now };
    this.registry.save(mergedPrimary);
    this.registry.save(mergedDuplicate);
    this.audit.record({ identityId: primary.id, action: "identity.merge", actor: dto.actor ?? "human-authority", outcome: "allowed", details: { duplicateIdentityId: duplicate.id } });
    return { primary: mergedPrimary, duplicate: mergedDuplicate };
  }

  listEvaluations(): readonly IdentityPolicyEvaluation[] { return [...this.evaluations]; }
}
