import { Injectable } from "@nestjs/common";
import {
  CapabilityDigitalDNA,
  CapabilityRegistrationInput,
  CapabilityValidationIssue,
  CapabilityValidationResult,
} from "./capability-fabric.types";

@Injectable()
export class CapabilityFoundationValidatorService {
  validateInput(input: CapabilityRegistrationInput): CapabilityValidationResult {
    const issues: CapabilityValidationIssue[] = [];

    this.required(issues, "key", input.key, "Capability key is required.");
    this.required(issues, "name", input.name, "Capability name is required.");
    this.required(issues, "owner", input.owner, "Capability owner is required.");
    this.required(issues, "summary", input.summary, "Purpose summary is required.");
    this.required(
      issues,
      "businessValue",
      input.businessValue,
      "Business value is required.",
    );

    if (input.key && !/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(input.key)) {
      issues.push({
        code: "CF_INVALID_KEY",
        severity: "BLOCKING",
        field: "key",
        message:
          "Capability key must use lowercase letters, numbers, dots, or hyphens.",
      });
    }

    if (input.version && !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(input.version)) {
      issues.push({
        code: "CF_INVALID_VERSION",
        severity: "BLOCKING",
        field: "version",
        message: "Capability version must be valid semantic versioning.",
      });
    }

    for (const dependency of input.dependencies ?? []) {
      if (!dependency.capabilityKey.trim()) {
        issues.push({
          code: "CF_INVALID_DEPENDENCY",
          severity: "BLOCKING",
          field: "dependencies",
          message: "Dependency capability key is required.",
        });
      }
      if (!dependency.versionRange.trim()) {
        issues.push({
          code: "CF_INVALID_DEPENDENCY_VERSION",
          severity: "ERROR",
          field: "dependencies",
          message: `Dependency ${dependency.capabilityKey} requires a version range.`,
        });
      }
    }

    return this.result(issues);
  }

  validateDNA(dna: CapabilityDigitalDNA): CapabilityValidationResult {
    const issues: CapabilityValidationIssue[] = [];

    if (dna.identity.key !== dna.identity.key.toLowerCase()) {
      issues.push({
        code: "CF_KEY_NOT_CANONICAL",
        severity: "BLOCKING",
        field: "identity.key",
        message: "Capability key must be canonical lowercase.",
      });
    }

    if (dna.operationalStatus === "ACTIVE") {
      if (dna.metrics.length === 0) {
        issues.push({
          code: "CF_ACTIVE_WITHOUT_METRICS",
          severity: "ERROR",
          field: "metrics",
          message: "Active capabilities must define operational metrics.",
        });
      }

      if (!dna.health.healthEndpoint && !dna.health.readinessEndpoint) {
        issues.push({
          code: "CF_ACTIVE_WITHOUT_HEALTH",
          severity: "ERROR",
          field: "health",
          message: "Active capabilities must define a health or readiness endpoint.",
        });
      }
    }

    if (
      dna.security.classification !== "PUBLIC" &&
      !dna.security.authenticationRequired
    ) {
      issues.push({
        code: "CF_AUTH_REQUIRED",
        severity: "BLOCKING",
        field: "security.authenticationRequired",
        message: "Non-public capabilities must require authentication.",
      });
    }

    if (dna.identity.kind === "API" && dna.contracts.length === 0) {
      issues.push({
        code: "CF_API_WITHOUT_CONTRACT",
        severity: "ERROR",
        field: "contracts",
        message: "API capabilities must publish at least one contract.",
      });
    }

    return this.result(issues);
  }

  private required(
    issues: CapabilityValidationIssue[],
    field: string,
    value: string | undefined,
    message: string,
  ) {
    if (!value?.trim()) {
      issues.push({
        code: `CF_REQUIRED_${field.toUpperCase()}`,
        severity: "BLOCKING",
        field,
        message,
      });
    }
  }

  private result(
    issues: CapabilityValidationIssue[],
  ): CapabilityValidationResult {
    const penalty = issues.reduce((total, issue) => {
      if (issue.severity === "BLOCKING") return total + 30;
      if (issue.severity === "ERROR") return total + 15;
      if (issue.severity === "WARNING") return total + 5;
      return total;
    }, 0);

    return {
      valid: !issues.some(
        (issue) =>
          issue.severity === "BLOCKING" || issue.severity === "ERROR",
      ),
      qualityScore: Math.max(0, 100 - penalty),
      issues,
      evaluatedAt: new Date().toISOString(),
    };
  }
}