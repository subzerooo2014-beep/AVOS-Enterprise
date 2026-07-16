import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  ArchitectureRule,
  ArchitectureRuleFinding,
  LivingBlueprintAsset
} from "../foundation-pack-10.types";
import { LivingBlueprintRegistryService } from "../blueprints/living-blueprint-registry.service";
import { ArchitectureAuditService } from "../observability/architecture-audit.service";

@Injectable()
export class ArchitectureRuleEngineService {
  private readonly rules = new Map<string, ArchitectureRule>([
    [
      "architecture-rule:purpose-required",
      {
        id: "architecture-rule:purpose-required",
        name: "Purpose Required",
        description:
          "Every architecture asset must define its purpose.",
        status: "active",
        severity: "error",
        assetTypes: [],
        field: "purpose",
        operator: "exists",
        message: "Architecture asset purpose is required.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    [
      "architecture-rule:version-required",
      {
        id: "architecture-rule:version-required",
        name: "Version Required",
        description:
          "Every architecture asset must define its version.",
        status: "active",
        severity: "error",
        assetTypes: [],
        field: "version",
        operator: "exists",
        message: "Architecture asset version is required.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  ]);

  private readonly findings:
    ArchitectureRuleFinding[] = [];

  constructor(
    private readonly blueprints: LivingBlueprintRegistryService,
    private readonly audit: ArchitectureAuditService
  ) {}

  listRules() {
    return Array.from(this.rules.values());
  }

  getRule(id: string) {
    const rule = this.rules.get(id);

    if (!rule) {
      throw new NotFoundException(
        `Architecture rule not found: ${id}`
      );
    }

    return rule;
  }

  register(
    input: Omit<ArchitectureRule, "createdAt" | "updatedAt">,
    context: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    const now = new Date().toISOString();

    const rule: ArchitectureRule = {
      ...input,
      assetTypes: Array.from(
        new Set(input.assetTypes)
      ),
      createdAt: now,
      updatedAt: now
    };

    this.rules.set(rule.id, rule);

    this.audit.record({
      correlationId: context.correlationId,
      category: "rule",
      action: "architecture-rule-registered",
      subjectId: rule.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        severity: rule.severity,
        operator: rule.operator
      }
    });

    return rule;
  }

  evaluate(input: {
    blueprintId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const blueprint = this.blueprints.get(
      input.blueprintId
    );

    this.findings.length = 0;

    for (const rule of this.listRules()) {
      if (rule.status !== "active") {
        continue;
      }

      for (const asset of blueprint.assets) {
        if (
          rule.assetTypes.length > 0 &&
          !rule.assetTypes.includes(asset.type)
        ) {
          continue;
        }

        if (!this.evaluateRule(rule, asset)) {
          this.findings.push({
            id: `architecture-rule-finding:${Date.now()}:${
              this.findings.length + 1
            }`,
            ruleId: rule.id,
            blueprintId: blueprint.id,
            assetId: asset.id,
            severity: rule.severity,
            message: rule.message,
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "rule",
      action: "architecture-rules-evaluated",
      subjectId: blueprint.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        this.findings.some(
          (finding) =>
            finding.severity === "critical" ||
            finding.severity === "error"
        )
          ? "failure"
          : this.findings.length > 0
            ? "warning"
            : "success",
      metadata: {
        findings: this.findings.length
      }
    });

    return {
      blueprintId: blueprint.id,
      valid: !this.findings.some(
        (finding) =>
          finding.severity === "critical" ||
          finding.severity === "error"
      ),
      findings: [...this.findings],
      checkedAt: new Date().toISOString()
    };
  }

  listFindings() {
    return [...this.findings];
  }

  summary() {
    return {
      rules: this.rules.size,
      activeRules: this.listRules().filter(
        (rule) => rule.status === "active"
      ).length,
      findings: this.findings.length,
      criticalFindings: this.findings.filter(
        (finding) => finding.severity === "critical"
      ).length,
      errorFindings: this.findings.filter(
        (finding) => finding.severity === "error"
      ).length
    };
  }

  private evaluateRule(
    rule: ArchitectureRule,
    asset: LivingBlueprintAsset
  ) {
    const value = this.resolveField(asset, rule.field);

    switch (rule.operator) {
      case "exists":
        return value !== undefined &&
          value !== null &&
          String(value).trim().length > 0;
      case "not-exists":
        return value === undefined || value === null;
      case "equals":
        return value === rule.value;
      case "not-equals":
        return value !== rule.value;
      case "contains":
        return Array.isArray(value)
          ? value.includes(rule.value)
          : String(value ?? "").includes(
              String(rule.value ?? "")
            );
      case "not-contains":
        return Array.isArray(value)
          ? !value.includes(rule.value)
          : !String(value ?? "").includes(
              String(rule.value ?? "")
            );
      case "minimum-count":
        return Array.isArray(value)
          ? value.length >= Number(rule.value)
          : false;
      case "maximum-count":
        return Array.isArray(value)
          ? value.length <= Number(rule.value)
          : false;
      default:
        return false;
    }
  }

  private resolveField(
    asset: LivingBlueprintAsset,
    field: string
  ) {
    const path = field.split(".");
    let current: unknown = asset;

    for (const segment of path) {
      if (
        typeof current !== "object" ||
        current === null
      ) {
        return undefined;
      }

      current = (current as Record<string, unknown>)[segment];
    }

    return current;
  }
}
