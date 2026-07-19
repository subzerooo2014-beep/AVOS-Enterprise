import { Injectable } from "@nestjs/common";
import {
  AuditRecord,
  ConstitutionalRule,
} from "./foundation-ultra-pack-a.types";
import { FoundationFileStoreService } from "./foundation-file-store.service";

@Injectable()
export class DigitalConstitutionService {
  constructor(private readonly store: FoundationFileStoreService) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.listRules().length > 0) return;
    const rules: Array<Omit<ConstitutionalRule, "id" | "createdAt" | "updatedAt">> = [
      {
        code: "FOUNDATION_FIRST",
        title: "Foundation First",
        description: "No major platform or product may bypass the certified AVOS foundation.",
        category: "foundation",
        mandatory: true,
        priority: 100,
        status: "active",
        version: "1.0.0",
      },
      {
        code: "HUMAN_FINAL_AUTHORITY",
        title: "Human Final Authority",
        description: "Humans retain final authority over consequential decisions and certifications.",
        category: "human-authority",
        mandatory: true,
        priority: 100,
        status: "active",
        version: "1.0.0",
      },
      {
        code: "GLOBAL_COMPLIANCE_READINESS_GATE",
        title: "Global Compliance Readiness Gate",
        description: "Foundation certification requires jurisdiction-aware compliance, auditability, privacy support and regulatory adaptability.",
        category: "compliance",
        mandatory: true,
        priority: 100,
        status: "active",
        version: "1.0.0",
      },
      {
        code: "CAPABILITY_FIRST",
        title: "Capability First",
        description: "Reusable capabilities are preferred over isolated product-specific implementations.",
        category: "architecture",
        mandatory: true,
        priority: 95,
        status: "active",
        version: "1.0.0",
      },
      {
        code: "BLUEPRINT_DRIVEN",
        title: "Blueprint Driven",
        description: "Architecture and runtime changes must remain synchronized with the Living Blueprint.",
        category: "architecture",
        mandatory: true,
        priority: 95,
        status: "active",
        version: "1.0.0",
      },
    ];
    for (const rule of rules) this.createRule(rule, "system:seed");
  }

  createRule(
    input: Omit<ConstitutionalRule, "id" | "createdAt" | "updatedAt">,
    actor = "human:khalifa",
  ): ConstitutionalRule {
    const timestamp = this.now();
    const record: ConstitutionalRule = {
      ...input,
      id: this.id("constitution"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.store.writeJson(`constitution/${record.id}.json`, record);
    this.audit("constitution.rule.created", actor, record.id, { code: record.code });
    return record;
  }

  listRules(): ConstitutionalRule[] {
    return this.store
      .listJson<ConstitutionalRule>("constitution")
      .sort((a, b) => b.priority - a.priority);
  }

  validate(context: Record<string, unknown>): {
    passed: boolean;
    score: number;
    violations: string[];
    evaluatedRules: number;
  } {
    const rules = this.listRules().filter((rule) => rule.status === "active");
    const violations: string[] = [];
    for (const rule of rules) {
      if (!rule.mandatory) continue;
      const value = context[rule.code];
      if (value !== true) violations.push(rule.code);
    }
    const score = rules.length === 0 ? 0 : Math.round(((rules.length - violations.length) / rules.length) * 100);
    return { passed: violations.length === 0, score, violations, evaluatedRules: rules.length };
  }

  private audit(action: string, actor: string, assetId: string, details: Record<string, unknown>): void {
    const record: AuditRecord = {
      id: this.id("audit"),
      action,
      actor,
      assetId,
      details,
      createdAt: this.now(),
    };
    this.store.writeJson(`audit/${record.id}.json`, record);
  }
}