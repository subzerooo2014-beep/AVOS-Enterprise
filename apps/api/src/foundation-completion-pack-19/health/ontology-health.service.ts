import { Injectable } from "@nestjs/common";
import {
  OntologyHealthIndex
} from "../foundation-pack-19.types";
import { EnterpriseOntologyRegistryService } from "../ontology/enterprise-ontology-registry.service";
import { OntologyTermRegistryService } from "../terms/ontology-term-registry.service";
import { OntologyRelationRegistryService } from "../relations/ontology-relation-registry.service";
import { OntologyConstraintRegistryService } from "../constraints/ontology-constraint-registry.service";
import { OntologyMappingService } from "../mapping/ontology-mapping.service";
import { OntologyValidatorService } from "../validation/ontology-validator.service";
import { OntologyAuditService } from "../observability/ontology-audit.service";

@Injectable()
export class OntologyHealthService {
  private readonly indexes =
    new Map<string, OntologyHealthIndex>();

  constructor(
    private readonly ontologies: EnterpriseOntologyRegistryService,
    private readonly terms: OntologyTermRegistryService,
    private readonly relations: OntologyRelationRegistryService,
    private readonly constraints: OntologyConstraintRegistryService,
    private readonly mappings: OntologyMappingService,
    private readonly validator: OntologyValidatorService,
    private readonly audit: OntologyAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    ontologyId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.ontologies.get(input.ontologyId);

    const terms = this.terms.byOntology(
      input.ontologyId
    );

    const relations = this.relations
      .list()
      .filter(
        (relation) =>
          relation.ontologyId === input.ontologyId
      );

    const constraints = this.constraints
      .list()
      .filter(
        (constraint) =>
          constraint.ontologyId === input.ontologyId
      );

    const mappings = this.mappings
      .list()
      .filter(
        (mapping) =>
          mapping.ontologyId === input.ontologyId
      );

    const validation = this.validator.summary();

    const definitionCoverageScore =
      terms.length === 0
        ? 0
        : this.clamp(
            (
              terms.filter(
                (term) =>
                  term.definition.trim().length > 0
              ).length /
              terms.length
            ) *
              100
          );

    const relationCoverageScore =
      terms.length === 0
        ? 0
        : this.clamp(
            (
              terms.filter((term) =>
                relations.some(
                  (relation) =>
                    relation.fromTermId === term.id ||
                    relation.toTermId === term.id
                )
              ).length /
              terms.length
            ) *
              100
          );

    const constraintCoverageScore =
      terms.length === 0
        ? 0
        : this.clamp(
            (
              terms.filter((term) =>
                constraints.some(
                  (constraint) =>
                    constraint.termId === term.id
                )
              ).length /
              terms.length
            ) *
              100
          );

    const mappingCoverageScore =
      terms.length === 0
        ? 0
        : this.clamp(
            (
              terms.filter((term) =>
                mappings.some(
                  (mapping) =>
                    mapping.termId === term.id
                )
              ).length /
              terms.length
            ) *
              100
          );

    const integrityScore = this.clamp(
      100 -
        validation.critical * 30 -
        validation.errors * 15 -
        validation.warnings * 5
    );

    const score = this.clamp(
      definitionCoverageScore * 0.3 +
        relationCoverageScore * 0.25 +
        constraintCoverageScore * 0.15 +
        mappingCoverageScore * 0.1 +
        integrityScore * 0.2
    );

    const reasons: string[] = [];

    if (definitionCoverageScore < 90) {
      reasons.push(
        "Ontology definition coverage is incomplete."
      );
    }

    if (relationCoverageScore < 70) {
      reasons.push(
        "Ontology relation coverage is incomplete."
      );
    }

    if (constraintCoverageScore < 50) {
      reasons.push(
        "Ontology constraint coverage is limited."
      );
    }

    if (mappingCoverageScore < 50) {
      reasons.push(
        "Ontology mapping coverage is limited."
      );
    }

    if (integrityScore < 80) {
      reasons.push(
        "Ontology integrity findings require resolution."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise ontology is healthy."
      );
    }

    const index: OntologyHealthIndex = {
      id: `ontology-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      ontologyId: input.ontologyId,
      score,
      level: this.level(score),
      metrics: {
        definitionCoverageScore,
        relationCoverageScore,
        constraintCoverageScore,
        mappingCoverageScore,
        integrityScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "ontology-health-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score < 60 ? "warning" : "success",
      metadata: {
        ontologyId: input.ontologyId,
        score,
        level: index.level
      }
    });

    return index;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      latestScore:
        items.length === 0
          ? 0
          : items[items.length - 1]?.score ?? 0,
      healthy: items.filter(
        (item) =>
          item.level === "healthy" ||
          item.level === "excellent"
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
  ): OntologyHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
