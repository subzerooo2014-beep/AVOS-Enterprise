import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainOntology } from "../enterprise-brain-mega-pack-2.types";
import { BrainKnowledgeGraphService } from "../knowledge/brain-knowledge-graph.service";
import { BrainKnowledgeAuditService } from "../observability/brain-knowledge-audit.service";

@Injectable()
export class BrainOntologyRegistryService {
  private readonly ontologies = new Map<string, BrainOntology>();

  constructor(
    private readonly graph: BrainKnowledgeGraphService,
    private readonly audit: BrainKnowledgeAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.ontologies.values());
  }

  get(id: string) {
    const ontology = this.ontologies.get(id);

    if (!ontology) {
      throw new NotFoundException(`Brain ontology not found: ${id}`);
    }

    return ontology;
  }

  register(
    input: Omit<BrainOntology, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.ontologies.has(input.id)) {
      throw new ConflictException(`Brain ontology already exists: ${input.id}`);
    }

    if (!/^\d+\.\d+\.\d+$/.test(input.version)) {
      throw new ConflictException(`Invalid ontology version: ${input.version}`);
    }

    for (const conceptId of input.conceptIds) {
      this.graph.getNode(conceptId);
    }

    const now = new Date().toISOString();

    const ontology: BrainOntology = {
      ...input,
      conceptIds: Array.from(new Set(input.conceptIds)),
      relationTypes: Array.from(new Set(input.relationTypes)),
      rules: input.rules.map((rule) => ({ ...rule })),
      createdAt: now,
      updatedAt: now
    };

    this.ontologies.set(ontology.id, ontology);

    this.audit.record({
      correlationId: context.correlationId,
      category: "ontology",
      action: "brain-ontology-registered",
      subjectId: ontology.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        version: ontology.version,
        concepts: ontology.conceptIds.length
      }
    });

    return ontology;
  }

  summary() {
    const ontologies = this.list();

    return {
      total: ontologies.length,
      active: ontologies.filter((x) => x.active).length,
      concepts: ontologies.reduce(
        (sum, ontology) => sum + ontology.conceptIds.length,
        0
      ),
      rules: ontologies.reduce(
        (sum, ontology) => sum + ontology.rules.length,
        0
      )
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const ontology: BrainOntology = {
      id: "ontology:avos-core",
      name: "AVOS Core Ontology",
      version: "1.0.0",
      description: "Core ontology for AVOS enterprise architecture.",
      conceptIds: [
        "knowledge:enterprise-brain",
        "knowledge:enterprise-kernel"
      ],
      relationTypes: [
        "depends-on",
        "implements",
        "extends",
        "contains",
        "governs",
        "supports"
      ],
      rules: [
        {
          id: "ontology-rule:brain-needs-kernel",
          description: "Enterprise Brain depends on certified Enterprise Kernel.",
          expression: "enterprise-brain depends-on enterprise-kernel",
          active: true
        }
      ],
      active: true,
      createdAt: now,
      updatedAt: now
    };

    this.ontologies.set(ontology.id, ontology);
  }
}
