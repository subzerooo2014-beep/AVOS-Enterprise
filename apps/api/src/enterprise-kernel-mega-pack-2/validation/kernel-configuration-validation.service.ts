import { Injectable } from "@nestjs/common";
import {
  KernelConfigurationEntry,
  KernelConfigurationValidationFinding
} from "../enterprise-kernel-mega-pack-2.types";
import { KernelConfigurationRegistryService } from "../configuration/kernel-configuration-registry.service";
import { KernelEnvironmentProfileService } from "../profiles/kernel-environment-profile.service";
import { KernelDependencyConfigurationAuditService } from "../observability/kernel-dependency-configuration-audit.service";

@Injectable()
export class KernelConfigurationValidationService {
  private readonly findings:
    KernelConfigurationValidationFinding[] = [];

  constructor(
    private readonly registry: KernelConfigurationRegistryService,
    private readonly profiles: KernelEnvironmentProfileService,
    private readonly audit: KernelDependencyConfigurationAuditService
  ) {}

  list() {
    return [...this.findings];
  }

  validate(input: {
    profileId?: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.findings.length = 0;

    const entries = input.profileId
      ? this.registry.resolveProfile(
          input.profileId
        ).entries
      : this.registry.list();

    const duplicateGroups =
      new Map<string, string[]>();

    for (const entry of entries) {
      const duplicateKey =
        `${entry.profileId}:${entry.environment}:${entry.key}`;

      const group =
        duplicateGroups.get(
          duplicateKey
        ) ?? [];

      group.push(entry.id);

      duplicateGroups.set(
        duplicateKey,
        group
      );

      this.validateEntry(entry);
    }

    for (const [key, ids] of duplicateGroups) {
      if (ids.length > 1) {
        for (const id of ids) {
          this.add(
            id,
            "error",
            "duplicate-key",
            `Duplicate kernel configuration key detected: ${key}.`
          );
        }
      }
    }

    if (input.profileId) {
      try {
        this.profiles.resolve(
          input.profileId
        );
      }
      catch (error) {
        this.add(
          input.profileId,
          "critical",
          "invalid-profile",
          error instanceof Error
            ? error.message
            : String(error)
        );
      }
    }

    const valid = !this.findings.some(
      (finding) =>
        finding.severity ===
          "critical" ||
        finding.severity === "error"
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "validation",
      action: "kernel-configuration-validated",
      subjectId:
        input.profileId ??
        "kernel-configuration-registry",
      actorIdentityId: input.actorIdentityId,
      outcome: valid
        ? this.findings.length > 0
          ? "warning"
          : "success"
        : "failure",
      metadata: {
        profileId: input.profileId,
        findings:
          this.findings.length
      }
    });

    return {
      valid,
      profileId: input.profileId,
      findings: [...this.findings],
      checkedAt: new Date().toISOString()
    };
  }

  summary() {
    return {
      total: this.findings.length,
      critical: this.findings.filter(
        (finding) =>
          finding.severity ===
          "critical"
      ).length,
      errors: this.findings.filter(
        (finding) =>
          finding.severity === "error"
      ).length,
      warnings: this.findings.filter(
        (finding) =>
          finding.severity ===
          "warning"
      ).length
    };
  }

  private validateEntry(
    entry: KernelConfigurationEntry
  ) {
    if (
      entry.required &&
      (
        entry.value === undefined ||
        entry.value === null ||
        entry.value === ""
      )
    ) {
      this.add(
        entry.id,
        "critical",
        "missing-required-value",
        `Required kernel configuration value is missing: ${entry.key}.`
      );
    }

    if (
      !this.matchesType(
        entry.value,
        entry.valueType
      )
    ) {
      this.add(
        entry.id,
        "error",
        "invalid-type",
        `Kernel configuration value type is invalid: ${entry.key}.`
      );
    }

    if (
      entry.secret &&
      typeof entry.value === "string" &&
      !entry.value.startsWith(
        "secret://"
      )
    ) {
      this.add(
        entry.id,
        "critical",
        "secret-value-exposed",
        `Kernel secret configuration must use a secret reference: ${entry.key}.`
      );
    }

    for (const rule of entry.validationRules) {
      switch (rule.type) {
        case "required":
          if (
            entry.value === undefined ||
            entry.value === null ||
            entry.value === ""
          ) {
            this.add(
              entry.id,
              "error",
              "missing-required-value",
              rule.message
            );
          }
          break;

        case "min":
          if (
            typeof entry.value === "number" &&
            entry.value <
              Number(rule.value)
          ) {
            this.add(
              entry.id,
              "error",
              "below-minimum",
              rule.message
            );
          }
          break;

        case "max":
          if (
            typeof entry.value === "number" &&
            entry.value >
              Number(rule.value)
          ) {
            this.add(
              entry.id,
              "error",
              "above-maximum",
              rule.message
            );
          }
          break;

        case "pattern":
          if (
            !new RegExp(
              String(rule.value ?? "")
            ).test(String(entry.value ?? ""))
          ) {
            this.add(
              entry.id,
              "error",
              "pattern-mismatch",
              rule.message
            );
          }
          break;

        case "one-of":
          if (
            !Array.isArray(rule.value) ||
            !rule.value.includes(
              entry.value
            )
          ) {
            this.add(
              entry.id,
              "error",
              "not-allowed",
              rule.message
            );
          }
          break;

        case "custom":
          break;
      }
    }
  }

  private matchesType(
    value: unknown,
    type: KernelConfigurationEntry["valueType"]
  ) {
    switch (type) {
      case "string":
        return typeof value === "string";
      case "number":
        return typeof value === "number";
      case "boolean":
        return typeof value === "boolean";
      case "json":
        return (
          typeof value === "object" &&
          value !== null
        );
      case "secret-reference":
        return (
          typeof value === "string" &&
          value.startsWith(
            "secret://"
          )
        );
    }
  }

  private add(
    entryId: string,
    severity: KernelConfigurationValidationFinding["severity"],
    code: KernelConfigurationValidationFinding["code"],
    message: string
  ) {
    this.findings.push({
      id: `kernel-config-validation:${Date.now()}:${
        this.findings.length + 1
      }`,
      entryId,
      severity,
      code,
      message,
      createdAt: new Date().toISOString()
    });
  }
}
