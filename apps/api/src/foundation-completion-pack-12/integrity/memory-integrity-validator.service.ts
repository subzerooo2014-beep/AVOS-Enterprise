import { createHash } from "crypto";
import { Injectable } from "@nestjs/common";
import {
  MemoryIntegrityFinding
} from "../foundation-pack-12.types";
import { EnterpriseMemoryRegistryService } from "../memory/enterprise-memory-registry.service";
import { MemoryLineageGraphService } from "../lineage/memory-lineage-graph.service";
import { MemoryAuditService } from "../observability/memory-audit.service";

@Injectable()
export class MemoryIntegrityValidatorService {
  private readonly findings:
    MemoryIntegrityFinding[] = [];

  constructor(
    private readonly memories: EnterpriseMemoryRegistryService,
    private readonly lineage: MemoryLineageGraphService,
    private readonly audit: MemoryAuditService
  ) {}

  validate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.findings.length = 0;

    for (const memory of this.memories.list()) {
      const {
        checksum,
        ...withoutChecksum
      } = memory;

      const calculated = createHash("sha256")
        .update(JSON.stringify(withoutChecksum))
        .digest("hex");

      if (calculated !== checksum) {
        this.add(
          "critical",
          "checksum-mismatch",
          memory.id,
          `Memory checksum mismatch: ${memory.id}.`,
          []
        );
      }

      if (memory.parentMemoryId) {
        try {
          this.memories.get(memory.parentMemoryId);
        }
        catch {
          this.add(
            "error",
            "missing-parent",
            memory.id,
            `Parent memory not found: ${memory.parentMemoryId}.`,
            [memory.parentMemoryId]
          );
        }
      }

      if (
        memory.status === "active" &&
        memory.expiresAt &&
        new Date(memory.expiresAt).getTime() <
          Date.now()
      ) {
        this.add(
          "warning",
          "expired-active-memory",
          memory.id,
          `Memory is active after expiration: ${memory.id}.`,
          []
        );
      }

      const relations = [
        ...this.lineage.incoming(memory.id),
        ...this.lineage.outgoing(memory.id)
      ];

      if (
        relations.length === 0 &&
        !memory.parentMemoryId
      ) {
        this.add(
          "info",
          "orphan-memory",
          memory.id,
          `Memory has no lineage relationships: ${memory.id}.`,
          []
        );
      }
    }

    for (const relation of this.lineage.list()) {
      for (const memoryId of [
        relation.fromMemoryId,
        relation.toMemoryId
      ]) {
        try {
          this.memories.get(memoryId);
        }
        catch {
          this.add(
            "critical",
            "missing-relation-target",
            memoryId,
            `Memory relation references missing memory: ${memoryId}.`,
            [relation.id]
          );
        }
      }
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "integrity",
      action: "memory-integrity-validated",
      subjectId: "enterprise-memory",
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
    severity: MemoryIntegrityFinding["severity"],
    code: MemoryIntegrityFinding["code"],
    memoryId: string,
    message: string,
    relatedIds: string[]
  ) {
    this.findings.push({
      id: `memory-integrity:${Date.now()}:${
        this.findings.length + 1
      }`,
      severity,
      code,
      memoryId,
      message,
      relatedIds,
      createdAt: new Date().toISOString()
    });
  }
}
