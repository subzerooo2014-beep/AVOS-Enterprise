import { Injectable, NotFoundException } from "@nestjs/common";
import { EnterpriseContract } from "../foundation-pack-3.types";
import { MetadataSchemaRegistryService } from "../metadata/metadata-schema-registry.service";
import { ContractCompatibilityValidatorService } from "../validation/contract-compatibility-validator.service";

@Injectable()
export class EnterpriseContractLayerService {
  private readonly contracts = new Map<string, EnterpriseContract>([
    [
      "contract:foundation-control-plane:1.0.0",
      {
        id: "contract:foundation-control-plane:1.0.0",
        name: "Foundation Control Plane Contract",
        version: "1.0.0",
        status: "active",
        ownerIdentityId: "identity:foundation-control-plane",
        outputSchemaId: "metadata:capability:1.0.0",
        eventsProduced: ["foundation.status.reported"],
        eventsConsumed: [],
        permissions: ["foundation.read"],
        dependencyContractIds: [],
        backwardCompatible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    [
      "contract:foundation-completion-pack-2:2.0.0",
      {
        id: "contract:foundation-completion-pack-2:2.0.0",
        name: "Foundation Completion Pack 2 Contract",
        version: "2.0.0",
        status: "active",
        ownerIdentityId: "identity:avos-platform",
        outputSchemaId: "metadata:capability:1.0.0",
        eventsProduced: [
          "foundation.identity.registered",
          "foundation.capability.registered",
          "foundation.dependency.analyzed"
        ],
        eventsConsumed: [],
        permissions: [
          "foundation.identity.read",
          "foundation.capability.read",
          "foundation.dependency.read"
        ],
        dependencyContractIds: [
          "contract:foundation-control-plane:1.0.0"
        ],
        backwardCompatible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  ]);

  constructor(
    private readonly schemas: MetadataSchemaRegistryService,
    private readonly compatibility: ContractCompatibilityValidatorService
  ) {}

  list() {
    return Array.from(this.contracts.values());
  }

  get(id: string) {
    const contract = this.contracts.get(id);

    if (!contract) {
      throw new NotFoundException(`Enterprise contract not found: ${id}`);
    }

    return contract;
  }

  register(
    input: Omit<EnterpriseContract, "createdAt" | "updatedAt">
  ) {
    const now = new Date().toISOString();

    const contract: EnterpriseContract = {
      ...input,
      eventsProduced: Array.from(new Set(input.eventsProduced)),
      eventsConsumed: Array.from(new Set(input.eventsConsumed)),
      permissions: Array.from(new Set(input.permissions)),
      dependencyContractIds: Array.from(
        new Set(input.dependencyContractIds)
      ),
      createdAt: now,
      updatedAt: now
    };

    this.contracts.set(contract.id, contract);
    return contract;
  }

  validateSchemaEvolution(previousSchemaId: string, nextSchemaId: string) {
    const previous = this.schemas.get(previousSchemaId);
    const next = this.schemas.get(nextSchemaId);

    return {
      previousSchemaId,
      nextSchemaId,
      ...this.compatibility.validateSchemas(previous, next)
    };
  }

  summary() {
    const contracts = this.list();

    return {
      total: contracts.length,
      active: contracts.filter((contract) => contract.status === "active")
        .length,
      backwardCompatible: contracts.filter(
        (contract) => contract.backwardCompatible
      ).length
    };
  }
}
