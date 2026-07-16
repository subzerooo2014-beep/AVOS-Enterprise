import { Injectable } from "@nestjs/common";
import {
  FoundationValidationFinding
} from "../foundation-pack-18.types";
import { FoundationComponentRegistryService } from "../registry/foundation-component-registry.service";
import { FoundationValidationAuditService } from "../observability/foundation-validation-audit.service";

@Injectable()
export class FoundationSelfValidationService {
  private readonly findings:
    FoundationValidationFinding[] = [];

  constructor(
    private readonly registry: FoundationComponentRegistryService,
    private readonly audit: FoundationValidationAuditService
  ) {}

  validate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.findings.length = 0;

    for (const component of this.registry.list()) {
      if (
        component.required &&
        component.status === "missing"
      ) {
        this.add(
          "critical",
          "missing-component",
          component.id,
          `Required foundation component is missing: ${component.name}.`,
          []
        );
      }

      if (
        component.required &&
        component.status === "partial"
      ) {
        this.add(
          "error",
          "partial-component",
          component.id,
          `Required foundation component is partial: ${component.name}.`,
          []
        );
      }

      if (!component.expectedModule.trim()) {
        this.add(
          "critical",
          "module-missing",
          component.id,
          "Expected module name is missing.",
          []
        );
      }

      if (!component.expectedRoute.trim()) {
        this.add(
          "warning",
          "route-missing",
          component.id,
          "Expected route is missing.",
          []
        );
      }

      if (
        !/^\d+\.\d+\.\d+$/.test(
          component.minimumVersion
        )
      ) {
        this.add(
          "error",
          "invalid-version",
          component.id,
          `Invalid component version: ${component.minimumVersion}.`,
          []
        );
      }

      for (const dependencyId of component.dependencies) {
        try {
          const dependency = this.registry.get(
            dependencyId
          );

          if (
            dependency.status === "missing" ||
            dependency.status === "degraded"
          ) {
            this.add(
              "critical",
              "dependency-missing",
              component.id,
              `Required dependency is unavailable: ${dependencyId}.`,
              [dependencyId]
            );
          }
        }
        catch {
          this.add(
            "critical",
            "dependency-missing",
            component.id,
            `Required dependency is not registered: ${dependencyId}.`,
            [dependencyId]
          );
        }
      }
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "validation",
      action: "foundation-self-validation-completed",
      subjectId: "foundation",
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
      valid: !this.findings.some(
        (finding) =>
          finding.severity === "critical" ||
          finding.severity === "error"
      ),
      findings: [...this.findings],
      checkedAt: new Date().toISOString()
    };
  }

  list() {
    return [...this.findings];
  }

  summary() {
    return {
      total: this.findings.length,
      critical: this.findings.filter(
        (finding) => finding.severity === "critical"
      ).length,
      errors: this.findings.filter(
        (finding) => finding.severity === "error"
      ).length,
      warnings: this.findings.filter(
        (finding) => finding.severity === "warning"
      ).length
    };
  }

  private add(
    severity: FoundationValidationFinding["severity"],
    code: FoundationValidationFinding["code"],
    componentId: string,
    message: string,
    relatedIds: string[]
  ) {
    this.findings.push({
      id: `foundation-validation:${Date.now()}:${
        this.findings.length + 1
      }`,
      severity,
      code,
      componentId,
      message,
      relatedIds,
      createdAt: new Date().toISOString()
    });
  }
}
