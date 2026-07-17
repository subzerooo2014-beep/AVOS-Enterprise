
import { Injectable } from "@nestjs/common";
import {
  KnowledgeGovernanceContext,
  KnowledgeGovernanceSubject,
  KnowledgePolicyEvaluation,
  KnowledgePolicyRule,
} from "./knowledge-governance.types";

@Injectable()
export class KnowledgePolicyEngineService {
  private readonly rules = new Map<string, KnowledgePolicyRule>();

  constructor() {
    this.register({ id: "default-read", name: "Default read", actions: ["read", "query", "search"], decision: "ALLOW", priority: 10, enabled: true });
    this.register({ id: "sensitive-write-review", name: "Sensitive write review", actions: ["write", "update", "publish"], allowedClassifications: ["CONFIDENTIAL", "RESTRICTED"], decision: "REVIEW", priority: 90, enabled: true });
    this.register({ id: "critical-low-trust-deny", name: "Critical low-trust deny", actions: ["publish", "activate"], minimumTrustScore: 70, decision: "DENY", priority: 100, enabled: true });
  }

  register(rule: KnowledgePolicyRule): KnowledgePolicyRule {
    this.rules.set(rule.id, { ...rule });
    return { ...rule };
  }

  list(): KnowledgePolicyRule[] {
    return [...this.rules.values()].sort((a, b) => b.priority - a.priority).map((rule) => ({ ...rule }));
  }

  evaluate(subject: KnowledgeGovernanceSubject, context: KnowledgeGovernanceContext): KnowledgePolicyEvaluation {
    const matchedRules: KnowledgePolicyRule[] = [];
    const reasons: string[] = [];
    for (const rule of this.list()) {
      if (!rule.enabled || !rule.actions.includes(context.action)) continue;
      if (rule.namespace && rule.namespace !== subject.namespace) continue;
      if (rule.allowedClassifications?.length && !rule.allowedClassifications.includes(subject.classification ?? "PUBLIC")) continue;
      if (rule.requiredRoles?.length && !rule.requiredRoles.some((role) => context.actorRoles?.includes(role))) continue;
      if (rule.minimumTrustScore !== undefined && (subject.trustScore ?? 0) >= rule.minimumTrustScore && rule.decision === "DENY") continue;
      matchedRules.push(rule);
      reasons.push(`${rule.id}:${rule.decision}`);
    }
    const decision = matchedRules.some((r) => r.decision === "DENY") ? "DENY" : matchedRules.some((r) => r.decision === "REVIEW") ? "REVIEW" : "ALLOW";
    return { decision, matchedRules: matchedRules.map((r) => r.id), reasons, evaluatedAt: new Date().toISOString() };
  }
}