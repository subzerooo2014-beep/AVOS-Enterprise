import { Injectable } from "@nestjs/common";
import {
  FoundationSdkDiagnosticFinding
} from "../foundation-pack-17.types";
import { FoundationCapabilityRegistryService } from "../registry/foundation-capability-registry.service";
import { FoundationApiContractRegistryService } from "../contracts/foundation-api-contract-registry.service";
import { FoundationSdkAuditService } from "../observability/foundation-sdk-audit.service";

@Injectable()
export class FoundationSdkDiagnosticsService {
  private readonly findings:
    FoundationSdkDiagnosticFinding[] = [];

  constructor(
    private readonly capabilities: FoundationCapabilityRegistryService,
    private readonly contracts: FoundationApiContractRegistryService,
    private readonly audit: FoundationSdkAuditService
  ) {}

  validate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.findings.length = 0;

    const capabilities = this.capabilities.list();

    for (const capability of capabilities) {
      if (!/^\d+\.\d+\.\d+$/.test(capability.version)) {
        this.add(
          "error",
          "invalid-version",
          capability.id,
          `Capability version is invalid: ${capability.version}.`,
          []
        );
      }

      if (!capability.providerModule.trim()) {
        this.add(
          "critical",
          "missing-provider",
          capability.id,
          "Capability provider module is missing.",
          []
        );
      }

      if (!capability.contractId) {
        this.add(
          "warning",
          "missing-contract",
          capability.id,
          "Capability has no API contract.",
          []
        );
      }
      else {
        try {
          this.contracts.get(capability.contractId);
        }
        catch {
          this.add(
            "error",
            "missing-contract",
            capability.id,
            `Capability contract not found: ${capability.contractId}.`,
            [capability.contractId]
          );
        }
      }

      for (const dependencyId of capability.dependencies) {
        try {
          const dependency = this.capabilities.get(
            dependencyId
          );

          if (dependency.status !== "active") {
            this.add(
              "warning",
              "inactive-dependency",
              capability.id,
              `Capability dependency is inactive: ${dependencyId}.`,
              [dependencyId]
            );
          }
        }
        catch {
          this.add(
            "critical",
            "missing-dependency",
            capability.id,
            `Capability dependency not found: ${dependencyId}.`,
            [dependencyId]
          );
        }
      }

      if (
        capability.status === "active" &&
        !capability.endpoint
      ) {
        this.add(
          "warning",
          "unreachable-capability",
          capability.id,
          "Active capability has no endpoint.",
          []
        );
      }

      const duplicates = capabilities.filter(
        (candidate) =>
          candidate.id !== capability.id &&
          candidate.domain === capability.domain &&
          candidate.name.toLowerCase() ===
            capability.name.toLowerCase()
      );

      if (duplicates.length > 0) {
        this.add(
          "error",
          "duplicate-capability",
          capability.id,
          `Duplicate capability detected: ${capability.name}.`,
          duplicates.map((item) => item.id)
        );
      }
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "diagnostics",
      action: "foundation-sdk-diagnostics-completed",
      subjectId: "foundation-sdk",
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
    severity: FoundationSdkDiagnosticFinding["severity"],
    code: FoundationSdkDiagnosticFinding["code"],
    subjectId: string,
    message: string,
    relatedIds: string[]
  ) {
    this.findings.push({
      id: `foundation-sdk-diagnostic:${Date.now()}:${
        this.findings.length + 1
      }`,
      severity,
      code,
      subjectId,
      message,
      relatedIds,
      createdAt: new Date().toISOString()
    });
  }
}
