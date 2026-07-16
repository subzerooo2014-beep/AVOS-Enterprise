import { Injectable } from "@nestjs/common";
import {
  ArchitectureValidationFinding
} from "../foundation-pack-9.types";
import { DigitalIdentityRegistryService } from "../identity/digital-identity-registry.service";
import { EnterpriseMetadataRegistryService } from "../metadata/enterprise-metadata-registry.service";
import { EnterpriseDependencyGraphService } from "../dependencies/enterprise-dependency-graph.service";
import { CapabilityContractRegistryService } from "../contracts/capability-contract-registry.service";
import { Foundation9AuditService } from "../observability/foundation-9-audit.service";

@Injectable()
export class ArchitectureFoundationValidatorService {
  private readonly findings:
    ArchitectureValidationFinding[] = [];

  constructor(
    private readonly identities: DigitalIdentityRegistryService,
    private readonly metadata: EnterpriseMetadataRegistryService,
    private readonly graph: EnterpriseDependencyGraphService,
    private readonly contracts: CapabilityContractRegistryService,
    private readonly audit: Foundation9AuditService
  ) {}

  validate(input: {
    correlationId: string;
    actorIdentityId: string;
  }) {
    this.findings.length = 0;

    for (const node of this.graph.listNodes()) {
      try {
        this.identities.get(node.identityId);
      }
      catch {
        this.add(
          "critical",
          "IDENTITY_MISSING",
          `Dependency node ${node.id} has no valid identity.`,
          node.id,
          [node.identityId]
        );
      }

      if (node.metadataRecordId) {
        try {
          this.metadata.get(node.metadataRecordId);
        }
        catch {
          this.add(
            "error",
            "METADATA_MISSING",
            `Dependency node ${node.id} references missing metadata.`,
            node.id,
            [node.metadataRecordId]
          );
        }
      }
      else {
        this.add(
          "warning",
          "METADATA_NOT_LINKED",
          `Dependency node ${node.id} has no linked metadata record.`,
          node.id,
          []
        );
      }
    }

    for (const edge of this.graph.listEdges()) {
      if (edge.contractId) {
        try {
          this.contracts.get(edge.contractId);
        }
        catch {
          this.add(
            "error",
            "CONTRACT_MISSING",
            `Dependency edge ${edge.id} references missing contract.`,
            edge.id,
            [edge.contractId]
          );
        }
      }

      if (edge.required && !edge.versionConstraint) {
        this.add(
          "warning",
          "VERSION_CONSTRAINT_MISSING",
          `Required dependency ${edge.id} has no version constraint.`,
          edge.id,
          [edge.fromNodeId, edge.toNodeId]
        );
      }
    }

    for (const cycle of this.graph.detectCycles()) {
      this.add(
        "critical",
        "DEPENDENCY_CYCLE",
        `Dependency cycle detected: ${cycle.join(" -> ")}`,
        cycle[0] ?? "unknown",
        cycle
      );
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "validation",
      action: "architecture-foundation-validated",
      subjectId: "foundation-pack-9",
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

  listFindings() {
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
    severity: ArchitectureValidationFinding["severity"],
    code: string,
    message: string,
    subjectId: string,
    relatedIds: string[]
  ) {
    this.findings.push({
      id: `architecture-finding:${Date.now()}:${
        this.findings.length + 1
      }`,
      severity,
      code,
      message,
      subjectId,
      relatedIds,
      createdAt: new Date().toISOString()
    });
  }
}
