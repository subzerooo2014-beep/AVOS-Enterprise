import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  FoundationSdkCapability,
  FoundationSdkStatus
} from "../foundation-pack-17.types";
import { FoundationSdkAuditService } from "../observability/foundation-sdk-audit.service";

@Injectable()
export class FoundationCapabilityRegistryService {
  private readonly capabilities =
    new Map<string, FoundationSdkCapability>();

  constructor(
    private readonly audit: FoundationSdkAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.capabilities.values());
  }

  get(id: string) {
    const capability = this.capabilities.get(id);

    if (!capability) {
      throw new NotFoundException(
        `Foundation SDK capability not found: ${id}`
      );
    }

    return capability;
  }

  register(
    input: Omit<FoundationSdkCapability, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const now = new Date().toISOString();

    const capability: FoundationSdkCapability = {
      ...input,
      operationTypes: Array.from(
        new Set(input.operationTypes)
      ),
      dependencies: Array.from(
        new Set(input.dependencies)
      ),
      tags: Array.from(new Set(input.tags)),
      createdAt: now,
      updatedAt: now
    };

    this.capabilities.set(
      capability.id,
      capability
    );

    this.audit.record({
      correlationId: context.correlationId,
      category: "capability",
      action: "foundation-capability-registered",
      subjectId: capability.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        domain: capability.domain,
        version: capability.version
      }
    });

    return capability;
  }

  updateStatus(
    id: string,
    status: FoundationSdkStatus,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    const updated: FoundationSdkCapability = {
      ...current,
      status,
      updatedAt: new Date().toISOString()
    };

    this.capabilities.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "capability",
      action: `foundation-capability-status:${status}`,
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        previousStatus: current.status
      }
    });

    return updated;
  }

  byDomain(domain: FoundationSdkCapability["domain"]) {
    return this.list().filter(
      (capability) => capability.domain === domain
    );
  }

  summary() {
    const capabilities = this.list();

    return {
      total: capabilities.length,
      active: capabilities.filter(
        (capability) => capability.status === "active"
      ).length,
      domains: new Set(
        capabilities.map((capability) => capability.domain)
      ).size,
      contracted: capabilities.filter(
        (capability) => Boolean(capability.contractId)
      ).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const seeded: FoundationSdkCapability[] = [
      {
        id: "foundation-sdk:identity",
        name: "Foundation Identity API",
        description:
          "Unified access to digital identity capabilities.",
        domain: "identity",
        version: "1.0.0",
        status: "active",
        operationTypes: [
          "query",
          "command",
          "validation"
        ],
        endpoint: "/foundation-sdk/identity",
        providerModule: "FoundationCompletionPack9Module",
        contractId: "foundation-contract:identity:v1",
        dependencies: [],
        tags: ["identity", "foundation"],
        metadata: {},
        createdAt: now,
        updatedAt: now
      },
      {
        id: "foundation-sdk:memory",
        name: "Foundation Memory API",
        description:
          "Unified access to enterprise memory capabilities.",
        domain: "memory",
        version: "1.0.0",
        status: "active",
        operationTypes: [
          "query",
          "command",
          "health"
        ],
        endpoint: "/foundation-sdk/memory",
        providerModule: "FoundationCompletionPack12Module",
        contractId: "foundation-contract:memory:v1",
        dependencies: ["foundation-sdk:identity"],
        tags: ["memory", "continuity"],
        metadata: {},
        createdAt: now,
        updatedAt: now
      },
      {
        id: "foundation-sdk:knowledge",
        name: "Foundation Knowledge API",
        description:
          "Unified access to enterprise knowledge graph capabilities.",
        domain: "knowledge",
        version: "1.0.0",
        status: "active",
        operationTypes: [
          "query",
          "command",
          "discovery"
        ],
        endpoint: "/foundation-sdk/knowledge",
        providerModule: "FoundationCompletionPack13Module",
        contractId: "foundation-contract:knowledge:v1",
        dependencies: [
          "foundation-sdk:identity",
          "foundation-sdk:memory"
        ],
        tags: ["knowledge", "graph"],
        metadata: {},
        createdAt: now,
        updatedAt: now
      },
      {
        id: "foundation-sdk:metadata",
        name: "Foundation Metadata API",
        description:
          "Unified access to metadata intelligence capabilities.",
        domain: "metadata",
        version: "1.0.0",
        status: "active",
        operationTypes: [
          "query",
          "command",
          "validation"
        ],
        endpoint: "/foundation-sdk/metadata",
        providerModule: "FoundationCompletionPack14Module",
        contractId: "foundation-contract:metadata:v1",
        dependencies: [
          "foundation-sdk:identity",
          "foundation-sdk:knowledge"
        ],
        tags: ["metadata", "catalog"],
        metadata: {},
        createdAt: now,
        updatedAt: now
      },
      {
        id: "foundation-sdk:digital-dna",
        name: "Foundation Digital DNA API",
        description:
          "Unified access to Digital DNA framework capabilities.",
        domain: "digital-dna",
        version: "1.0.0",
        status: "active",
        operationTypes: [
          "query",
          "command",
          "validation",
          "health"
        ],
        endpoint: "/foundation-sdk/digital-dna",
        providerModule: "FoundationCompletionPack15Module",
        contractId: "foundation-contract:digital-dna:v1",
        dependencies: [
          "foundation-sdk:identity",
          "foundation-sdk:metadata"
        ],
        tags: ["dna", "architecture"],
        metadata: {},
        createdAt: now,
        updatedAt: now
      },
      {
        id: "foundation-sdk:digital-genome",
        name: "Foundation Digital Genome API",
        description:
          "Unified access to Enterprise Digital Genome capabilities.",
        domain: "digital-genome",
        version: "1.0.0",
        status: "active",
        operationTypes: [
          "query",
          "command",
          "validation",
          "health"
        ],
        endpoint: "/foundation-sdk/digital-genome",
        providerModule: "FoundationCompletionPack16Module",
        contractId: "foundation-contract:digital-genome:v1",
        dependencies: [
          "foundation-sdk:digital-dna"
        ],
        tags: ["genome", "enterprise"],
        metadata: {},
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const capability of seeded) {
      this.capabilities.set(
        capability.id,
        capability
      );
    }
  }
}
