import { Injectable, NotFoundException } from "@nestjs/common";
import { CanonicalConcept } from "../foundation-pack-3.types";

@Injectable()
export class EnterpriseLanguageCoreService {
  private readonly concepts = new Map<string, CanonicalConcept>([
    [
      "concept:capability",
      {
        id: "concept:capability",
        canonicalName: "Capability",
        displayName: "Capability",
        description: "A reusable ability that produces measurable value.",
        domain: "foundation",
        category: "foundation",
        synonyms: ["ability", "platform capability"],
        relatedConceptIds: ["concept:engine", "concept:service"],
        version: "1.0.0",
        status: "active"
      }
    ],
    [
      "concept:engine",
      {
        id: "concept:engine",
        canonicalName: "Engine",
        displayName: "Engine",
        description: "A reusable execution component that powers one or more capabilities.",
        domain: "runtime",
        category: "runtime",
        synonyms: ["core engine"],
        relatedConceptIds: ["concept:capability", "concept:service"],
        version: "1.0.0",
        status: "active"
      }
    ],
    [
      "concept:service",
      {
        id: "concept:service",
        canonicalName: "Service",
        displayName: "Platform Service",
        description: "An exposed operational capability with a stable contract.",
        domain: "runtime",
        category: "runtime",
        synonyms: ["platform service"],
        relatedConceptIds: ["concept:engine", "concept:contract"],
        version: "1.0.0",
        status: "active"
      }
    ],
    [
      "concept:contract",
      {
        id: "concept:contract",
        canonicalName: "Contract",
        displayName: "Enterprise Contract",
        description: "A versioned declaration of inputs, outputs, events, permissions, and dependencies.",
        domain: "governance",
        category: "governance",
        synonyms: ["service contract", "interface contract"],
        relatedConceptIds: ["concept:service", "concept:metadata"],
        version: "1.0.0",
        status: "active"
      }
    ],
    [
      "concept:metadata",
      {
        id: "concept:metadata",
        canonicalName: "Metadata",
        displayName: "Enterprise Metadata",
        description: "Structured descriptive information about AVOS assets.",
        domain: "knowledge",
        category: "knowledge",
        synonyms: ["asset metadata"],
        relatedConceptIds: ["concept:contract", "concept:capability"],
        version: "1.0.0",
        status: "active"
      }
    ]
  ]);

  list() {
    return Array.from(this.concepts.values());
  }

  get(id: string) {
    const concept = this.concepts.get(id);

    if (!concept) {
      throw new NotFoundException(`Canonical concept not found: ${id}`);
    }

    return concept;
  }

  search(query: string) {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return this.list();
    }

    return this.list().filter((concept) => {
      const searchable = [
        concept.id,
        concept.canonicalName,
        concept.displayName,
        concept.description,
        concept.domain,
        ...concept.synonyms
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalized);
    });
  }

  relationships() {
    return this.list().flatMap((concept) =>
      concept.relatedConceptIds.map((relatedConceptId) => ({
        from: concept.id,
        to: relatedConceptId,
        relation: "related-to"
      }))
    );
  }

  summary() {
    const concepts = this.list();

    return {
      total: concepts.length,
      active: concepts.filter((concept) => concept.status === "active").length,
      relationships: this.relationships().length
    };
  }
}
