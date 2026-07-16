import { Injectable } from "@nestjs/common";
import {
  MemoryHealthIndex
} from "../foundation-pack-12.types";
import { EnterpriseMemoryRegistryService } from "../memory/enterprise-memory-registry.service";
import { ContextAssemblyEngineService } from "../contexts/context-assembly-engine.service";
import { KnowledgeContinuityService } from "../continuity/knowledge-continuity.service";
import { MemoryIntegrityValidatorService } from "../integrity/memory-integrity-validator.service";
import { MemoryRetentionPolicyService } from "../retention/memory-retention-policy.service";
import { MemoryAuditService } from "../observability/memory-audit.service";

@Injectable()
export class MemoryHealthIndexService {
  private readonly indexes =
    new Map<string, MemoryHealthIndex>();

  constructor(
    private readonly memories: EnterpriseMemoryRegistryService,
    private readonly contexts: ContextAssemblyEngineService,
    private readonly continuity: KnowledgeContinuityService,
    private readonly integrity: MemoryIntegrityValidatorService,
    private readonly retention: MemoryRetentionPolicyService,
    private readonly audit: MemoryAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const memories = this.memories.list();
    const integrity = this.integrity.summary();
    const continuity = this.continuity.summary();
    const contexts = this.contexts.summary();
    const retention = this.retention.summary();

    const integrityScore = this.clamp(
      100 -
        integrity.critical * 30 -
        integrity.errors * 15 -
        integrity.warnings * 5
    );

    const continuityScore =
      memories.length === 0
        ? 100
        : this.clamp(
            (continuity.latestMemoryCoverage /
              memories.length) *
              100
          );

    const activeMemories = memories.filter(
      (memory) => memory.status === "active"
    );

    const retrievalCoverageScore =
      memories.length === 0
        ? 100
        : this.clamp(
            (activeMemories.length /
              memories.length) *
              100
          );

    const retentionComplianceScore =
      retention.active > 0 ? 100 : 0;

    const contextCoverageScore =
      memories.length === 0
        ? 100
        : this.clamp(
            Math.min(
              100,
              contexts.averageMemories > 0
                ? (contexts.averageMemories /
                    Math.max(1, memories.length)) *
                    100
                : 0
            )
          );

    const score = this.clamp(
      integrityScore * 0.3 +
        continuityScore * 0.25 +
        retrievalCoverageScore * 0.15 +
        retentionComplianceScore * 0.15 +
        contextCoverageScore * 0.15
    );

    const reasons: string[] = [];

    if (integrityScore < 80) {
      reasons.push(
        "Memory integrity requires improvement."
      );
    }

    if (continuityScore < 80) {
      reasons.push(
        "Knowledge continuity coverage is incomplete."
      );
    }

    if (contextCoverageScore < 60) {
      reasons.push(
        "Memory context coverage is limited."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise memory is healthy and continuous."
      );
    }

    const index: MemoryHealthIndex = {
      id: `memory-health-index:${Date.now()}:${
        this.indexes.size + 1
      }`,
      score,
      level: this.level(score),
      metrics: {
        integrityScore,
        continuityScore,
        retrievalCoverageScore,
        retentionComplianceScore,
        contextCoverageScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "memory-health-index-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score < 60 ? "warning" : "success",
      metadata: {
        score,
        level: index.level
      }
    });

    return index;
  }

  summary() {
    const indexes = this.list();

    return {
      total: indexes.length,
      latestScore:
        indexes.length === 0
          ? 0
          : indexes[indexes.length - 1]?.score ?? 0,
      healthy: indexes.filter(
        (index) =>
          index.level === "healthy" ||
          index.level === "excellent"
      ).length
    };
  }

  private clamp(value: number) {
    return Math.max(
      0,
      Math.min(100, Number(value.toFixed(2)))
    );
  }

  private level(
    score: number
  ): MemoryHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
