import { Injectable } from "@nestjs/common";
import {
  AuditRecord,
  GovernancePolicy,
  PolicyEvaluation,
} from "./foundation-ultra-pack-c.types";
import { FoundationUltraPackCFileStoreService } from "./foundation-ultra-pack-c-file-store.service";

@Injectable()
export class GovernancePolicyRuntimeService {
  constructor(
    private readonly store: FoundationUltraPackCFileStoreService,
  ) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.listPolicies().length > 0) {
      return;
    }

    const seeds: Array<Omit<GovernancePolicy, "id" | "createdAt" | "updatedAt">> = [
      {
        code: "HUMAN_FINAL_AUTHORITY",
        name: "Human Final Authority",
        description: "Consequential approvals and certifications require an accountable human authority.",
        domain: "governance",
        scope: ["certification", "high-impact-decisions"],
        jurisdictionScope: ["global"],
        rules: [
          {
            field: "approvedBy",
            operator: "contains",
            value: "human:",
            message: "approvedBy must identify a human authority.",
          },
        ],
        enforcement: "blocking",
        priority: 100,
        version: "1.0.0",
        status: "active",
        owner: "AVOS Governance",
        approvedBy: "human:khalifa",
      },
      {
        code: "GLOBAL_COMPLIANCE_READINESS_GATE",
        name: "Global Compliance Readiness Gate",
        description: "Every foundation capability must support jurisdiction-aware compliance and regulatory adaptability.",
        domain: "compliance",
        scope: ["foundation", "platform", "capability", "product"],
        jurisdictionScope: ["global"],
        rules: [
          {
            field: "jurisdictionAware",
            operator: "equals",
            value: true,
            message: "Jurisdiction awareness is mandatory.",
          },
          {
            field: "auditability",
            operator: "equals",
            value: true,
            message: "Auditability is mandatory.",
          },
        ],
        enforcement: "blocking",
        priority: 100,
        version: "1.0.0",
        status: "active",
        owner: "AVOS Compliance",
        approvedBy: "human:khalifa",
      },
      {
        code: "ZERO_TRUST_REQUIRED",
        name: "Zero Trust Required",
        description: "Every access request must be explicitly evaluated.",
        domain: "security",
        scope: ["identity", "access", "runtime"],
        jurisdictionScope: ["global"],
        rules: [
          {
            field: "explicitlyEvaluated",
            operator: "equals",
            value: true,
            message: "Access must be explicitly evaluated.",
          },
          {
            field: "trustScore",
            operator: "gte",
            value: 70,
            message: "Trust score must meet the minimum threshold.",
          },
        ],
        enforcement: "blocking",
        priority: 95,
        version: "1.0.0",
        status: "active",
        owner: "AVOS Security",
        approvedBy: "human:khalifa",
      },
      {
        code: "PRIVACY_BY_DESIGN",
        name: "Privacy by Design",
        description: "Data processing must declare purpose, lawful basis and data minimization.",
        domain: "privacy",
        scope: ["data-processing", "analytics", "ai"],
        jurisdictionScope: ["global"],
        rules: [
          {
            field: "purposeDeclared",
            operator: "equals",
            value: true,
            message: "Processing purpose must be declared.",
          },
          {
            field: "lawfulBasisDeclared",
            operator: "equals",
            value: true,
            message: "Lawful basis must be declared.",
          },
          {
            field: "dataMinimized",
            operator: "equals",
            value: true,
            message: "Data minimization must be applied.",
          },
        ],
        enforcement: "blocking",
        priority: 95,
        version: "1.0.0",
        status: "active",
        owner: "AVOS Privacy",
        approvedBy: "human:khalifa",
      },
    ];

    for (const seed of seeds) {
      this.createPolicy(seed, "system:seed");
    }
  }

  createPolicy(
    input: Omit<GovernancePolicy, "id" | "createdAt" | "updatedAt">,
    actor = "human:khalifa",
  ): GovernancePolicy {
    const existing = this.listPolicies().find(
      (policy) =>
        policy.code === input.code &&
        policy.version === input.version,
    );

    if (existing) {
      return existing;
    }

    const timestamp = this.now();
    const record: GovernancePolicy = {
      ...input,
      id: this.id("policy"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`policies/${record.id}.json`, record);
    this.audit("policy.created", actor, record.id, {
      code: record.code,
      enforcement: record.enforcement,
    });

    return record;
  }

  listPolicies(): GovernancePolicy[] {
    return this.store
      .listJson<GovernancePolicy>("policies")
      .sort((a, b) => b.priority - a.priority);
  }

  evaluate(
    policyCode: string,
    subject: string,
    context: Record<string, unknown>,
  ): PolicyEvaluation {
    const policy = this.listPolicies().find(
      (item) =>
        item.code === policyCode &&
        item.status === "active",
    );

    if (!policy) {
      throw new Error(`Active policy not found: ${policyCode}`);
    }

    const violations: string[] = [];

    for (const rule of policy.rules) {
      const actual = context[rule.field];
      let passed = false;

      switch (rule.operator) {
        case "equals":
          passed = actual === rule.value;
          break;
        case "not-equals":
          passed = actual !== rule.value;
          break;
        case "contains":
          passed =
            typeof actual === "string" &&
            actual.includes(String(rule.value ?? ""));
          break;
        case "in":
          passed =
            Array.isArray(rule.value) &&
            rule.value.includes(actual);
          break;
        case "gte":
          passed =
            typeof actual === "number" &&
            typeof rule.value === "number" &&
            actual >= rule.value;
          break;
        case "lte":
          passed =
            typeof actual === "number" &&
            typeof rule.value === "number" &&
            actual <= rule.value;
          break;
        case "exists":
          passed = actual !== undefined && actual !== null;
          break;
      }

      if (!passed) {
        violations.push(rule.message);
      }
    }

    const score =
      policy.rules.length === 0
        ? 100
        : Math.round(
            ((policy.rules.length - violations.length) /
              policy.rules.length) *
              100,
          );

    const result: PolicyEvaluation = {
      id: this.id("policy-evaluation"),
      policyId: policy.id,
      subject,
      passed: violations.length === 0,
      score,
      violations,
      evidence: context,
      evaluatedAt: this.now(),
    };

    this.store.writeJson(
      `policy-evaluations/${result.id}.json`,
      result,
    );

    return result;
  }

  listEvaluations(): PolicyEvaluation[] {
    return this.store.listJson<PolicyEvaluation>(
      "policy-evaluations",
    );
  }

  private audit(
    action: string,
    actor: string,
    assetId: string,
    details: Record<string, unknown>,
  ): void {
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