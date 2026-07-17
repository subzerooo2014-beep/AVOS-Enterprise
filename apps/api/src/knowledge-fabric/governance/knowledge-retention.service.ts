
import { Injectable } from "@nestjs/common";
import { KnowledgeGovernanceSubject, KnowledgeRetentionPolicy } from "./knowledge-governance.types";

@Injectable()
export class KnowledgeRetentionService {
  private readonly policies = new Map<string, KnowledgeRetentionPolicy>();

  constructor() {
    this.register({ id: "default-retention", retentionDays: 2555, archiveAfterDays: 730, legalHold: false, enabled: true });
  }

  register(policy: KnowledgeRetentionPolicy): KnowledgeRetentionPolicy {
    this.policies.set(policy.id, { ...policy });
    return { ...policy };
  }

  list(): KnowledgeRetentionPolicy[] {
    return [...this.policies.values()].map((policy) => ({ ...policy }));
  }

  resolve(subject: KnowledgeGovernanceSubject): KnowledgeRetentionPolicy | undefined {
    return this.list().find((policy) => policy.enabled && (!policy.namespace || policy.namespace === subject.namespace) && (!policy.classification || policy.classification === subject.classification));
  }

  evaluate(subject: KnowledgeGovernanceSubject): { action: "KEEP" | "ARCHIVE" | "DELETE" | "HOLD"; policyId?: string; ageDays: number } {
    const policy = this.resolve(subject);
    const created = new Date(subject.createdAt ?? Date.now()).getTime();
    const ageDays = Math.max(0, Math.floor((Date.now() - created) / 86_400_000));
    if (!policy) return { action: "KEEP", ageDays };
    if (policy.legalHold) return { action: "HOLD", policyId: policy.id, ageDays };
    if (ageDays >= policy.retentionDays) return { action: "DELETE", policyId: policy.id, ageDays };
    if (policy.archiveAfterDays !== undefined && ageDays >= policy.archiveAfterDays) return { action: "ARCHIVE", policyId: policy.id, ageDays };
    return { action: "KEEP", policyId: policy.id, ageDays };
  }
}