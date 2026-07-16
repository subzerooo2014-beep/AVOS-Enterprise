import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  OntologyTerm,
  OntologyTermStatus,
  OntologyTermType
} from "../foundation-pack-19.types";
import { EnterpriseOntologyRegistryService } from "../ontology/enterprise-ontology-registry.service";
import { OntologyAuditService } from "../observability/ontology-audit.service";

@Injectable()
export class OntologyTermRegistryService {
  private readonly terms =
    new Map<string, OntologyTerm>();

  constructor(
    private readonly ontologies: EnterpriseOntologyRegistryService,
    private readonly audit: OntologyAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.terms.values());
  }

  get(id: string) {
    const term = this.terms.get(id);

    if (!term) {
      throw new NotFoundException(
        `Ontology term not found: ${id}`
      );
    }

    return term;
  }

  byOntology(ontologyId: string) {
    this.ontologies.get(ontologyId);

    return this.list().filter(
      (term) => term.ontologyId === ontologyId
    );
  }

  register(input: {
    id?: string;
    ontologyId: string;
    canonicalName: string;
    displayName: string;
    definition: string;
    termType: OntologyTermType;
    status?: OntologyTermStatus;
    aliases?: string[];
    attributes?: Record<string, unknown>;
    parentTermIds?: string[];
    externalReferences?: string[];
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.ontologies.get(input.ontologyId);

    for (const parentId of input.parentTermIds ?? []) {
      this.get(parentId);
    }

    const now = new Date().toISOString();

    const term: OntologyTerm = {
      id:
        input.id ??
        `ontology-term:${this.slug(input.canonicalName)}`,
      ontologyId: input.ontologyId,
      canonicalName: input.canonicalName.trim(),
      displayName: input.displayName.trim(),
      definition: input.definition.trim(),
      termType: input.termType,
      status: input.status ?? "draft",
      aliases: Array.from(new Set(input.aliases ?? [])),
      attributes: input.attributes ?? {},
      parentTermIds: Array.from(
        new Set(input.parentTermIds ?? [])
      ),
      externalReferences: Array.from(
        new Set(input.externalReferences ?? [])
      ),
      createdAt: now,
      updatedAt: now
    };

    this.terms.set(term.id, term);

    this.audit.record({
      correlationId: input.correlationId,
      category: "term",
      action: "ontology-term-registered",
      subjectId: term.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        ontologyId: term.ontologyId,
        termType: term.termType
      }
    });

    return term;
  }

  update(
    id: string,
    patch: {
      displayName?: string;
      definition?: string;
      status?: OntologyTermStatus;
      aliases?: string[];
      attributes?: Record<string, unknown>;
      parentTermIds?: string[];
      externalReferences?: string[];
    },
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    for (const parentId of patch.parentTermIds ?? []) {
      this.get(parentId);
    }

    const updated: OntologyTerm = {
      ...current,
      ...patch,
      aliases:
        patch.aliases === undefined
          ? current.aliases
          : Array.from(new Set(patch.aliases)),
      attributes: {
        ...current.attributes,
        ...(patch.attributes ?? {})
      },
      parentTermIds:
        patch.parentTermIds === undefined
          ? current.parentTermIds
          : Array.from(new Set(patch.parentTermIds)),
      externalReferences:
        patch.externalReferences === undefined
          ? current.externalReferences
          : Array.from(
              new Set(patch.externalReferences)
            ),
      updatedAt: new Date().toISOString()
    };

    this.terms.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "term",
      action: "ontology-term-updated",
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        ontologyId: updated.ontologyId,
        status: updated.status
      }
    });

    return updated;
  }

  resolve(value: string) {
    const normalized = value.trim().toLowerCase();

    return this.list().find(
      (term) =>
        term.id.toLowerCase() === normalized ||
        term.canonicalName.toLowerCase() === normalized ||
        term.displayName.toLowerCase() === normalized ||
        term.aliases.some(
          (alias) => alias.toLowerCase() === normalized
        )
    );
  }

  summary() {
    const terms = this.list();

    return {
      total: terms.length,
      active: terms.filter(
        (term) => term.status === "active"
      ).length,
      entityTerms: terms.filter(
        (term) => term.termType === "entity"
      ).length,
      capabilityTerms: terms.filter(
        (term) => term.termType === "capability"
      ).length,
      workflowTerms: terms.filter(
        (term) => term.termType === "workflow"
      ).length
    };
  }

  private seed() {
    const ontologyId = "avos-enterprise-ontology";
    const now = new Date().toISOString();

    const definitions: Array<{
      id: string;
      canonicalName: string;
      displayName: string;
      definition: string;
      termType: OntologyTermType;
    }> = [
      {
        id: "ontology-term:entity",
        canonicalName: "Entity",
        displayName: "Entity",
        definition:
          "A uniquely identifiable semantic object within AVOS.",
        termType: "entity"
      },
      {
        id: "ontology-term:capability",
        canonicalName: "Capability",
        displayName: "Capability",
        definition:
          "A reusable ability that delivers a defined outcome.",
        termType: "capability"
      },
      {
        id: "ontology-term:product",
        canonicalName: "Product",
        displayName: "Product",
        definition:
          "A packaged value proposition delivered to users or organizations.",
        termType: "product"
      },
      {
        id: "ontology-term:workflow",
        canonicalName: "Workflow",
        displayName: "Workflow",
        definition:
          "An ordered sequence of governed activities.",
        termType: "workflow"
      },
      {
        id: "ontology-term:decision",
        canonicalName: "Decision",
        displayName: "Decision",
        definition:
          "A traceable choice made from evaluated alternatives.",
        termType: "decision"
      },
      {
        id: "ontology-term:policy",
        canonicalName: "Policy",
        displayName: "Policy",
        definition:
          "A governed rule that constrains or directs behavior.",
        termType: "policy"
      },
      {
        id: "ontology-term:knowledge",
        canonicalName: "Knowledge",
        displayName: "Knowledge",
        definition:
          "Validated information with context, meaning, and provenance.",
        termType: "knowledge"
      },
      {
        id: "ontology-term:event",
        canonicalName: "Event",
        displayName: "Event",
        definition:
          "A time-bound occurrence that communicates a state change.",
        termType: "event"
      }
    ];

    for (const definition of definitions) {
      this.terms.set(definition.id, {
        ...definition,
        ontologyId,
        status: "active",
        aliases: [],
        attributes: {},
        parentTermIds:
          definition.id === "ontology-term:entity"
            ? []
            : ["ontology-term:entity"],
        externalReferences: [],
        createdAt: now,
        updatedAt: now
      });
    }
  }

  private slug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}
