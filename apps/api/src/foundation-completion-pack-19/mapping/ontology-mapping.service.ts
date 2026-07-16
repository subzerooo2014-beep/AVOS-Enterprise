import { Injectable } from "@nestjs/common";
import {
  OntologyMapping
} from "../foundation-pack-19.types";
import { EnterpriseOntologyRegistryService } from "../ontology/enterprise-ontology-registry.service";
import { OntologyTermRegistryService } from "../terms/ontology-term-registry.service";
import { OntologyAuditService } from "../observability/ontology-audit.service";

@Injectable()
export class OntologyMappingService {
  private readonly mappings =
    new Map<string, OntologyMapping>();

  constructor(
    private readonly ontologies: EnterpriseOntologyRegistryService,
    private readonly terms: OntologyTermRegistryService,
    private readonly audit: OntologyAuditService
  ) {}

  list() {
    return Array.from(this.mappings.values());
  }

  register(input: {
    ontologyId: string;
    termId: string;
    sourceSystem: string;
    sourceType: string;
    sourceValue: string;
    targetValue: string;
    confidence?: number;
    metadata?: Record<string, unknown>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.ontologies.get(input.ontologyId);
    this.terms.get(input.termId);

    const mapping: OntologyMapping = {
      id: `ontology-mapping:${Date.now()}:${
        this.mappings.size + 1
      }`,
      ontologyId: input.ontologyId,
      termId: input.termId,
      sourceSystem: input.sourceSystem,
      sourceType: input.sourceType,
      sourceValue: input.sourceValue,
      targetValue: input.targetValue,
      confidence: Math.max(
        0,
        Math.min(100, input.confidence ?? 100)
      ),
      metadata: input.metadata ?? {},
      createdAt: new Date().toISOString()
    };

    this.mappings.set(mapping.id, mapping);

    this.audit.record({
      correlationId: input.correlationId,
      category: "mapping",
      action: "ontology-mapping-registered",
      subjectId: mapping.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        termId: mapping.termId,
        sourceSystem: mapping.sourceSystem
      }
    });

    return mapping;
  }

  resolve(
    sourceSystem: string,
    sourceValue: string
  ) {
    return this.list()
      .filter(
        (mapping) =>
          mapping.sourceSystem === sourceSystem &&
          mapping.sourceValue === sourceValue
      )
      .sort(
        (left, right) =>
          right.confidence - left.confidence
      );
  }

  summary() {
    return {
      total: this.mappings.size,
      sourceSystems: new Set(
        this.list().map(
          (mapping) => mapping.sourceSystem
        )
      ).size,
      highConfidence: this.list().filter(
        (mapping) => mapping.confidence >= 80
      ).length
    };
  }
}
