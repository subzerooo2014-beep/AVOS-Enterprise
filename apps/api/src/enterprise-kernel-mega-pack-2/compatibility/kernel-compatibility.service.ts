import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KernelCompatibilityAssessment,
  KernelCompatibilityRule,
  KernelCompatibilityStatus
} from "../enterprise-kernel-mega-pack-2.types";
import { KernelDependencyGraphService } from "../dependencies/kernel-dependency-graph.service";
import { KernelDependencyConfigurationAuditService } from "../observability/kernel-dependency-configuration-audit.service";

@Injectable()
export class KernelCompatibilityService {
  private readonly rules =
    new Map<string, KernelCompatibilityRule>();

  private readonly assessments =
    new Map<string, KernelCompatibilityAssessment>();

  constructor(
    private readonly graph: KernelDependencyGraphService,
    private readonly audit: KernelDependencyConfigurationAuditService
  ) {
    this.seed();
  }

  listRules() {
    return Array.from(this.rules.values());
  }

  getRule(id: string) {
    const rule = this.rules.get(id);

    if (!rule) {
      throw new NotFoundException(
        `Kernel compatibility rule not found: ${id}`
      );
    }

    return rule;
  }

  registerRule(
    input: Omit<
      KernelCompatibilityRule,
      "createdAt" | "updatedAt"
    >,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    this.graph.getNode(input.subjectNodeId);
    this.graph.getNode(input.dependencyNodeId);

    const now = new Date().toISOString();

    const rule: KernelCompatibilityRule = {
      ...input,
      conditions: Array.from(
        new Set(input.conditions)
      ),
      rationale: Array.from(
        new Set(input.rationale)
      ),
      createdAt: now,
      updatedAt: now
    };

    this.rules.set(rule.id, rule);

    this.audit.record({
      correlationId: context.correlationId,
      category: "compatibility",
      action: "kernel-compatibility-rule-registered",
      subjectId: rule.id,
      actorIdentityId: context.actorIdentityId,
      outcome:
        rule.status === "incompatible"
          ? "warning"
          : "success",
      metadata: {
        subjectNodeId: rule.subjectNodeId,
        dependencyNodeId:
          rule.dependencyNodeId,
        status: rule.status
      }
    });

    return rule;
  }

  assess(input: {
    subjectNodeId: string;
    dependencyNodeId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const subject = this.graph.getNode(
      input.subjectNodeId
    );

    const dependency = this.graph.getNode(
      input.dependencyNodeId
    );

    const matchedRules = this.listRules().filter(
      (rule) =>
        rule.active &&
        rule.subjectNodeId === subject.id &&
        rule.dependencyNodeId ===
          dependency.id &&
        this.matchesRange(
          subject.version,
          rule.subjectVersionRange
        ) &&
        this.matchesRange(
          dependency.version,
          rule.dependencyVersionRange
        )
    );

    let status: KernelCompatibilityStatus =
      "unknown";

    const conditions: string[] = [];
    const findings: string[] = [];

    if (matchedRules.length > 0) {
      const incompatible =
        matchedRules.find(
          (rule) =>
            rule.status === "incompatible"
        );

      const conditional =
        matchedRules.find(
          (rule) =>
            rule.status ===
            "conditionally-compatible"
        );

      if (incompatible) {
        status = "incompatible";
        findings.push(
          ...incompatible.rationale
        );
      }
      else if (conditional) {
        status =
          "conditionally-compatible";
        conditions.push(
          ...conditional.conditions
        );
      }
      else {
        status = "compatible";
      }
    }
    else {
      status =
        this.major(subject.version) ===
        this.major(dependency.version)
          ? "compatible"
          : "unknown";

      if (status === "unknown") {
        findings.push(
          "No explicit compatibility rule matched."
        );
      }
    }

    const assessment: KernelCompatibilityAssessment = {
      id: `kernel-compatibility-assessment:${Date.now()}:${
        this.assessments.size + 1
      }`,
      subjectNodeId: subject.id,
      dependencyNodeId: dependency.id,
      subjectVersion: subject.version,
      dependencyVersion:
        dependency.version,
      status,
      matchedRuleIds: matchedRules.map(
        (rule) => rule.id
      ),
      conditions:
        Array.from(new Set(conditions)),
      findings:
        Array.from(new Set(findings)),
      assessedAt: new Date().toISOString()
    };

    this.assessments.set(
      assessment.id,
      assessment
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "compatibility",
      action: "kernel-compatibility-assessed",
      subjectId: assessment.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        status === "incompatible"
          ? "blocked"
          : status ===
            "conditionally-compatible"
            ? "warning"
            : "success",
      metadata: {
        subjectNodeId: subject.id,
        dependencyNodeId:
          dependency.id,
        status
      }
    });

    return assessment;
  }

  assessAll(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const assessments = [];

    for (const edge of this.graph.listEdges()) {
      assessments.push(
        this.assess({
          subjectNodeId: edge.fromNodeId,
          dependencyNodeId: edge.toNodeId,
          actorIdentityId:
            input.actorIdentityId,
          correlationId:
            input.correlationId
        })
      );
    }

    return {
      total: assessments.length,
      compatible: assessments.filter(
        (item) =>
          item.status === "compatible"
      ).length,
      conditional: assessments.filter(
        (item) =>
          item.status ===
          "conditionally-compatible"
      ).length,
      incompatible: assessments.filter(
        (item) =>
          item.status === "incompatible"
      ).length,
      unknown: assessments.filter(
        (item) => item.status === "unknown"
      ).length,
      assessments
    };
  }

  listAssessments() {
    return Array.from(
      this.assessments.values()
    );
  }

  summary() {
    const assessments =
      this.listAssessments();

    return {
      rules: this.rules.size,
      activeRules: this.listRules().filter(
        (rule) => rule.active
      ).length,
      assessments: assessments.length,
      compatible: assessments.filter(
        (item) =>
          item.status === "compatible"
      ).length,
      incompatible: assessments.filter(
        (item) =>
          item.status === "incompatible"
      ).length
    };
  }

  private matchesRange(
    version: string,
    range: string
  ) {
    if (
      range === "*" ||
      range === version
    ) {
      return true;
    }

    const major = this.major(version);

    if (range.startsWith(">=")) {
      return (
        this.compareVersions(
          version,
          range.slice(2)
        ) >= 0
      );
    }

    if (range.startsWith("^")) {
      return (
        major ===
        this.major(range.slice(1))
      );
    }

    return false;
  }

  private major(version: string) {
    return Number(
      version.split(".")[0] ?? "0"
    );
  }

  private compareVersions(
    left: string,
    right: string
  ) {
    const leftParts = left
      .split(".")
      .map(Number);

    const rightParts = right
      .split(".")
      .map(Number);

    for (let index = 0; index < 3; index += 1) {
      const a = leftParts[index] ?? 0;
      const b = rightParts[index] ?? 0;

      if (a > b) return 1;
      if (a < b) return -1;
    }

    return 0;
  }

  private seed() {
    const now = new Date().toISOString();

    const rules: KernelCompatibilityRule[] = [
      {
        id: "kernel-compat:lifecycle-runtime:v1",
        subjectNodeId:
          "kernel-node:lifecycle",
        subjectVersionRange: "^1.0.0",
        dependencyNodeId:
          "kernel-node:runtime",
        dependencyVersionRange: "^1.0.0",
        status: "compatible",
        conditions: [],
        rationale: [
          "Kernel lifecycle v1 is designed for kernel runtime v1."
        ],
        active: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-compat:dependency-runtime:v1",
        subjectNodeId:
          "kernel-node:dependency-config",
        subjectVersionRange: "^1.0.0",
        dependencyNodeId:
          "kernel-node:runtime",
        dependencyVersionRange: "^1.0.0",
        status: "compatible",
        conditions: [],
        rationale: [
          "Dependency and configuration core v1 is compatible with runtime v1."
        ],
        active: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-compat:dependency-lifecycle:v1",
        subjectNodeId:
          "kernel-node:dependency-config",
        subjectVersionRange: "^1.0.0",
        dependencyNodeId:
          "kernel-node:lifecycle",
        dependencyVersionRange: "^1.0.0",
        status: "compatible",
        conditions: [],
        rationale: [
          "Dependency resolution v1 controls lifecycle v1 activation."
        ],
        active: true,
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const rule of rules) {
      this.rules.set(rule.id, rule);
    }
  }
}
