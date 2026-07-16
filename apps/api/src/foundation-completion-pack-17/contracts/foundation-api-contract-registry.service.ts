import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  FoundationApiContract
} from "../foundation-pack-17.types";
import { FoundationSdkAuditService } from "../observability/foundation-sdk-audit.service";

@Injectable()
export class FoundationApiContractRegistryService {
  private readonly contracts =
    new Map<string, FoundationApiContract>();

  constructor(
    private readonly audit: FoundationSdkAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.contracts.values());
  }

  get(id: string) {
    const contract = this.contracts.get(id);

    if (!contract) {
      throw new NotFoundException(
        `Foundation API contract not found: ${id}`
      );
    }

    return contract;
  }

  register(
    input: Omit<FoundationApiContract, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const now = new Date().toISOString();

    const contract: FoundationApiContract = {
      ...input,
      guarantees: Array.from(
        new Set(input.guarantees)
      ),
      constraints: Array.from(
        new Set(input.constraints)
      ),
      compatibilityVersions: Array.from(
        new Set(input.compatibilityVersions)
      ),
      createdAt: now,
      updatedAt: now
    };

    this.contracts.set(contract.id, contract);

    this.audit.record({
      correlationId: context.correlationId,
      category: "contract",
      action: "foundation-api-contract-registered",
      subjectId: contract.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        domain: contract.domain,
        version: contract.version
      }
    });

    return contract;
  }

  compatible(id: string, version: string) {
    const contract = this.get(id);

    return (
      contract.version === version ||
      contract.compatibilityVersions.includes(version)
    );
  }

  summary() {
    const contracts = this.list();

    return {
      total: contracts.length,
      active: contracts.filter(
        (contract) => contract.active
      ).length,
      domains: new Set(
        contracts.map((contract) => contract.domain)
      ).size
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const definitions: Array<{
      id: string;
      name: string;
      domain: FoundationApiContract["domain"];
    }> = [
      {
        id: "foundation-contract:identity:v1",
        name: "Foundation Identity Contract",
        domain: "identity"
      },
      {
        id: "foundation-contract:memory:v1",
        name: "Foundation Memory Contract",
        domain: "memory"
      },
      {
        id: "foundation-contract:knowledge:v1",
        name: "Foundation Knowledge Contract",
        domain: "knowledge"
      },
      {
        id: "foundation-contract:metadata:v1",
        name: "Foundation Metadata Contract",
        domain: "metadata"
      },
      {
        id: "foundation-contract:digital-dna:v1",
        name: "Foundation Digital DNA Contract",
        domain: "digital-dna"
      },
      {
        id: "foundation-contract:digital-genome:v1",
        name: "Foundation Digital Genome Contract",
        domain: "digital-genome"
      }
    ];

    for (const definition of definitions) {
      this.contracts.set(definition.id, {
        id: definition.id,
        name: definition.name,
        version: "1.0.0",
        domain: definition.domain,
        requestSchema: {
          type: "object"
        },
        responseSchema: {
          type: "object"
        },
        guarantees: [
          "traceable-response",
          "correlation-id-preserved",
          "human-final-authority"
        ],
        constraints: [
          "foundation-only",
          "versioned-contract"
        ],
        compatibilityVersions: ["1.0.0"],
        active: true,
        createdAt: now,
        updatedAt: now
      });
    }
  }
}
