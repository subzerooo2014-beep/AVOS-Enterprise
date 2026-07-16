import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  OntologyDefinition,
  OntologyTermStatus
} from "../foundation-pack-19.types";
import { OntologyAuditService } from "../observability/ontology-audit.service";

@Injectable()
export class EnterpriseOntologyRegistryService {
  private readonly ontologies =
    new Map<string, OntologyDefinition>();

  constructor(
    private readonly audit: OntologyAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.ontologies.values());
  }

  get(id: string) {
    const ontology = this.ontologies.get(id);

    if (!ontology) {
      throw new NotFoundException(
        `Enterprise ontology not found: ${id}`
      );
    }

    return ontology;
  }

  register(
    input: Omit<OntologyDefinition, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const now = new Date().toISOString();

    const ontology: OntologyDefinition = {
      ...input,
      domains: Array.from(new Set(input.domains)),
      createdAt: now,
      updatedAt: now
    };

    this.ontologies.set(ontology.id, ontology);

    this.audit.record({
      correlationId: context.correlationId,
      category: "ontology",
      action: "enterprise-ontology-registered",
      subjectId: ontology.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        namespace: ontology.namespace,
        version: ontology.version
      }
    });

    return ontology;
  }

  update(
    id: string,
    patch: {
      description?: string;
      version?: string;
      status?: OntologyTermStatus;
      ownerIdentityId?: string;
      domains?: string[];
      metadata?: Record<string, unknown>;
    },
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    const updated: OntologyDefinition = {
      ...current,
      ...patch,
      domains:
        patch.domains === undefined
          ? current.domains
          : Array.from(new Set(patch.domains)),
      metadata: {
        ...current.metadata,
        ...(patch.metadata ?? {})
      },
      updatedAt: new Date().toISOString()
    };

    this.ontologies.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "ontology",
      action: "enterprise-ontology-updated",
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        previousVersion: current.version,
        nextVersion: updated.version
      }
    });

    return updated;
  }

  summary() {
    const ontologies = this.list();

    return {
      total: ontologies.length,
      active: ontologies.filter(
        (ontology) => ontology.status === "active"
      ).length,
      domains: new Set(
        ontologies.flatMap(
          (ontology) => ontology.domains
        )
      ).size
    };
  }

  private seed() {
    const now = new Date().toISOString();

    this.ontologies.set("avos-enterprise-ontology", {
      id: "avos-enterprise-ontology",
      name: "AVOS Enterprise Ontology",
      description:
        "Canonical semantic model for AVOS enterprise assets and relationships.",
      namespace: "avos://enterprise/ontology",
      version: "1.0.0",
      status: "active",
      ownerIdentityId: "avos:foundation",
      domains: [
        "architecture",
        "capabilities",
        "products",
        "workflows",
        "decisions",
        "policies",
        "knowledge",
        "events",
        "agents",
        "services",
        "data",
        "organizations"
      ],
      metadata: {
        foundation: true
      },
      createdAt: now,
      updatedAt: now
    });
  }
}
