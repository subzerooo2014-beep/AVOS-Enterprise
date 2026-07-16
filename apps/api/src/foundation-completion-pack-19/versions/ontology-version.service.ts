import { Injectable } from "@nestjs/common";
import {
  OntologyVersionRecord
} from "../foundation-pack-19.types";
import { EnterpriseOntologyRegistryService } from "../ontology/enterprise-ontology-registry.service";
import { OntologyTermRegistryService } from "../terms/ontology-term-registry.service";
import { OntologyRelationRegistryService } from "../relations/ontology-relation-registry.service";
import { OntologyConstraintRegistryService } from "../constraints/ontology-constraint-registry.service";
import { OntologyAuditService } from "../observability/ontology-audit.service";

@Injectable()
export class OntologyVersionService {
  private readonly versions =
    new Map<string, OntologyVersionRecord>();

  constructor(
    private readonly ontologies: EnterpriseOntologyRegistryService,
    private readonly terms: OntologyTermRegistryService,
    private readonly relations: OntologyRelationRegistryService,
    private readonly constraints: OntologyConstraintRegistryService,
    private readonly audit: OntologyAuditService
  ) {}

  list() {
    return Array.from(this.versions.values());
  }

  create(input: {
    ontologyId: string;
    version: string;
    changeSummary: string;
    createdByIdentityId: string;
    correlationId: string;
  }) {
    this.ontologies.get(input.ontologyId);

    const version: OntologyVersionRecord = {
      id: `ontology-version:${input.ontologyId}:${input.version}`,
      ontologyId: input.ontologyId,
      version: input.version,
      termIds: this.terms
        .byOntology(input.ontologyId)
        .map((term) => term.id),
      relationIds: this.relations
        .list()
        .filter(
          (relation) =>
            relation.ontologyId === input.ontologyId
        )
        .map((relation) => relation.id),
      constraintIds: this.constraints
        .list()
        .filter(
          (constraint) =>
            constraint.ontologyId === input.ontologyId
        )
        .map((constraint) => constraint.id),
      changeSummary: input.changeSummary,
      createdByIdentityId: input.createdByIdentityId,
      createdAt: new Date().toISOString()
    };

    this.versions.set(version.id, version);

    this.ontologies.update(
      input.ontologyId,
      {
        version: input.version
      },
      {
        actorIdentityId: input.createdByIdentityId,
        correlationId: input.correlationId
      }
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "version",
      action: "ontology-version-created",
      subjectId: version.id,
      actorIdentityId: input.createdByIdentityId,
      outcome: "success",
      metadata: {
        ontologyId: version.ontologyId,
        version: version.version,
        terms: version.termIds.length
      }
    });

    return version;
  }

  summary() {
    return {
      total: this.versions.size,
      ontologiesVersioned: new Set(
        this.list().map(
          (version) => version.ontologyId
        )
      ).size
    };
  }
}
