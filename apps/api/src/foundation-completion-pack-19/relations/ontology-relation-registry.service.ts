import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import {
  OntologyRelation,
  OntologyRelationType
} from "../foundation-pack-19.types";
import { EnterpriseOntologyRegistryService } from "../ontology/enterprise-ontology-registry.service";
import { OntologyTermRegistryService } from "../terms/ontology-term-registry.service";
import { OntologyAuditService } from "../observability/ontology-audit.service";

@Injectable()
export class OntologyRelationRegistryService {
  private readonly relations =
    new Map<string, OntologyRelation>();

  constructor(
    private readonly ontologies: EnterpriseOntologyRegistryService,
    private readonly terms: OntologyTermRegistryService,
    private readonly audit: OntologyAuditService
  ) {}

  list() {
    return Array.from(this.relations.values());
  }

  register(input: {
    ontologyId: string;
    fromTermId: string;
    toTermId: string;
    relation: OntologyRelationType;
    label: string;
    cardinality: OntologyRelation["cardinality"];
    transitive?: boolean;
    symmetric?: boolean;
    metadata?: Record<string, unknown>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.ontologies.get(input.ontologyId);

    if (input.fromTermId === input.toTermId) {
      throw new BadRequestException(
        "Ontology relation cannot self-reference."
      );
    }

    this.terms.get(input.fromTermId);
    this.terms.get(input.toTermId);

    const duplicate = this.list().find(
      (relation) =>
        relation.ontologyId === input.ontologyId &&
        relation.fromTermId === input.fromTermId &&
        relation.toTermId === input.toTermId &&
        relation.relation === input.relation
    );

    if (duplicate) {
      return duplicate;
    }

    const relation: OntologyRelation = {
      id: `ontology-relation:${Date.now()}:${
        this.relations.size + 1
      }`,
      ontologyId: input.ontologyId,
      fromTermId: input.fromTermId,
      toTermId: input.toTermId,
      relation: input.relation,
      label: input.label,
      cardinality: input.cardinality,
      transitive: input.transitive ?? false,
      symmetric: input.symmetric ?? false,
      metadata: input.metadata ?? {},
      createdAt: new Date().toISOString()
    };

    this.relations.set(relation.id, relation);

    this.audit.record({
      correlationId: input.correlationId,
      category: "relation",
      action: "ontology-relation-registered",
      subjectId: relation.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        relation: relation.relation,
        fromTermId: relation.fromTermId,
        toTermId: relation.toTermId
      }
    });

    return relation;
  }

  byTerm(termId: string) {
    this.terms.get(termId);

    return this.list().filter(
      (relation) =>
        relation.fromTermId === termId ||
        relation.toTermId === termId
    );
  }

  summary() {
    const relations = this.list();

    return {
      total: relations.length,
      inheritance: relations.filter(
        (relation) => relation.relation === "is-a"
      ).length,
      dependency: relations.filter(
        (relation) => relation.relation === "depends-on"
      ).length,
      governance: relations.filter(
        (relation) => relation.relation === "governed-by"
      ).length
    };
  }
}
