import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  CapabilityContract,
  ContractStatus
} from "../foundation-pack-9.types";
import { DigitalIdentityRegistryService } from "../identity/digital-identity-registry.service";
import { Foundation9AuditService } from "../observability/foundation-9-audit.service";

@Injectable()
export class CapabilityContractRegistryService {
  private readonly contracts =
    new Map<string, CapabilityContract>();

  constructor(
    private readonly identities: DigitalIdentityRegistryService,
    private readonly audit: Foundation9AuditService
  ) {}

  list() {
    return Array.from(this.contracts.values());
  }

  get(id: string) {
    const contract = this.contracts.get(id);

    if (!contract) {
      throw new NotFoundException(
        `Capability contract not found: ${id}`
      );
    }

    return contract;
  }

  register(
    input: Omit<CapabilityContract, "createdAt" | "updatedAt">,
    context: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    this.identities.get(input.providerIdentityId);

    for (const consumerId of input.consumerIdentityIds) {
      this.identities.get(consumerId);
    }

    const now = new Date().toISOString();

    const contract: CapabilityContract = {
      ...input,
      consumerIdentityIds: Array.from(
        new Set(input.consumerIdentityIds)
      ),
      guarantees: Array.from(new Set(input.guarantees)),
      constraints: Array.from(new Set(input.constraints)),
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
      action: "contract-registered",
      subjectId: contract.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        providerIdentityId: contract.providerIdentityId,
        version: contract.version,
        type: contract.contractType
      }
    });

    return contract;
  }

  updateStatus(
    id: string,
    status: ContractStatus,
    context: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    const current = this.get(id);

    const updated: CapabilityContract = {
      ...current,
      status,
      updatedAt: new Date().toISOString()
    };

    this.contracts.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "contract",
      action: `contract-status:${status}`,
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {}
    });

    return updated;
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
        (contract) => contract.status === "active"
      ).length,
      deprecated: contracts.filter(
        (contract) => contract.status === "deprecated"
      ).length,
      eventContracts: contracts.filter(
        (contract) => contract.contractType === "event"
      ).length,
      apiContracts: contracts.filter(
        (contract) => contract.contractType === "api"
      ).length
    };
  }
}
