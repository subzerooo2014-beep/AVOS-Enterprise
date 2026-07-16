import { Injectable } from "@nestjs/common";
import {
  GenomeHealthIndex
} from "../foundation-pack-16.types";
import { EnterpriseDigitalGenomeRegistryService } from "../genome/enterprise-digital-genome-registry.service";
import { GenomeCompositionEngineService } from "../composition/genome-composition-engine.service";
import { GenomeValidatorService } from "../validation/genome-validator.service";
import { GenomeEvolutionService } from "../evolution/genome-evolution.service";
import { GenomeAuditService } from "../observability/genome-audit.service";

@Injectable()
export class GenomeHealthService {
  private readonly indexes =
    new Map<string, GenomeHealthIndex>();

  constructor(
    private readonly registry: EnterpriseDigitalGenomeRegistryService,
    private readonly composition: GenomeCompositionEngineService,
    private readonly validator: GenomeValidatorService,
    private readonly evolution: GenomeEvolutionService,
    private readonly audit: GenomeAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    genomeId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const genome = this.registry.get(
      input.genomeId
    );

    const validation = this.validator.summary();
    const balance = this.composition.calculateBalance(
      genome.id
    );

    const layerCompletenessScore =
      genome.layers.length === 0
        ? 0
        : this.clamp(
            genome.layers.reduce(
              (sum, layer) =>
                sum + layer.completenessScore,
              0
            ) / genome.layers.length
          );

    const totalDna = genome.layers.reduce(
      (sum, layer) =>
        sum + layer.dnaReferences.length,
      0
    );

    const activeDna = genome.layers.reduce(
      (sum, layer) =>
        sum +
        layer.dnaReferences.filter(
          (reference) =>
            reference.status === "active"
        ).length,
      0
    );

    const dnaCoverageScore =
      totalDna === 0
        ? 0
        : this.clamp(
            (activeDna / totalDna) * 100
          );

    const relationIntegrityScore =
      genome.crossLayerRelations.length === 0
        ? 70
        : 100;

    const balanceScore = balance.score;

    const evolutionReadinessScore =
      this.evolution.summary().breaking > 0
        ? 70
        : 100;

    const score = this.clamp(
      layerCompletenessScore * 0.25 +
        dnaCoverageScore * 0.25 +
        relationIntegrityScore * 0.2 +
        balanceScore * 0.15 +
        evolutionReadinessScore * 0.15 -
        validation.critical * 10 -
        validation.errors * 5
    );

    const reasons: string[] = [];

    if (layerCompletenessScore < 80) {
      reasons.push(
        "Genome layer completeness requires improvement."
      );
    }

    if (dnaCoverageScore < 80) {
      reasons.push(
        "Active Digital DNA coverage is incomplete."
      );
    }

    if (relationIntegrityScore < 80) {
      reasons.push(
        "Cross-layer relation coverage is limited."
      );
    }

    if (balanceScore < 70) {
      reasons.push(
        "Genome composition is unbalanced."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise digital genome is healthy."
      );
    }

    const index: GenomeHealthIndex = {
      id: `genome-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      genomeId: genome.id,
      score,
      level: this.level(score),
      metrics: {
        layerCompletenessScore,
        dnaCoverageScore,
        relationIntegrityScore,
        balanceScore,
        evolutionReadinessScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "enterprise-genome-health-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score < 60 ? "warning" : "success",
      metadata: {
        genomeId: genome.id,
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
  ): GenomeHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
