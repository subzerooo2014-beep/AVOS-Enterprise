import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { KernelMessageContract } from "../enterprise-kernel-mega-pack-5.types";
import { KernelMessagingAuditService } from "../observability/kernel-messaging-audit.service";

@Injectable()
export class KernelMessageContractRegistryService {
  private readonly contracts = new Map<string, KernelMessageContract>();

  constructor(
    private readonly audit: KernelMessagingAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.contracts.values());
  }

  get(id: string) {
    const contract = this.contracts.get(id);

    if (!contract) {
      throw new NotFoundException(`Kernel message contract not found: ${id}`);
    }

    return contract;
  }

  register(
    input: Omit<KernelMessageContract, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.contracts.has(input.id)) {
      throw new ConflictException(`Kernel message contract already exists: ${input.id}`);
    }

    if (!/^\d+\.\d+\.\d+$/.test(input.version)) {
      throw new ConflictException(`Invalid kernel message contract version: ${input.version}`);
    }

    const now = new Date().toISOString();

    const contract: KernelMessageContract = {
      ...input,
      requiredFields: Array.from(new Set(input.requiredFields)),
      producerIds: Array.from(new Set(input.producerIds)),
      consumerIds: Array.from(new Set(input.consumerIds)),
      createdAt: now,
      updatedAt: now
    };

    this.contracts.set(contract.id, contract);

    this.audit.record({
      correlationId: context.correlationId,
      category: "contract",
      action: "kernel-message-contract-registered",
      subjectId: contract.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        kind: contract.kind,
        version: contract.version
      }
    });

    return contract;
  }

  validatePayload(contractId: string, payload: Record<string, unknown>) {
    const contract = this.get(contractId);
    const missing = contract.requiredFields.filter(
      (field) => payload[field] === undefined || payload[field] === null
    );

    return {
      valid: missing.length === 0,
      missingFields: missing,
      contractId: contract.id,
      checkedAt: new Date().toISOString()
    };
  }

  summary() {
    const contracts = this.list();

    return {
      total: contracts.length,
      active: contracts.filter((x) => x.active).length,
      events: contracts.filter((x) => x.kind === "event").length,
      commands: contracts.filter((x) => x.kind === "command").length,
      queries: contracts.filter((x) => x.kind === "query").length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const contracts: KernelMessageContract[] = [
      {
        id: "kernel-contract:event.module-state-changed",
        name: "kernel.module-state-changed",
        kind: "event",
        version: "1.0.0",
        schema: {},
        requiredFields: ["moduleId", "fromState", "toState"],
        producerIds: ["kernel:lifecycle"],
        consumerIds: ["kernel:runtime", "kernel:observability"],
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-contract:command.execute-operation",
        name: "kernel.execute-operation",
        kind: "command",
        version: "1.0.0",
        schema: {},
        requiredFields: ["resource", "action"],
        producerIds: ["kernel:orchestrator"],
        consumerIds: ["kernel:execution"],
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-contract:command.compensate-operation",
        name: "kernel.compensate-operation",
        kind: "command",
        version: "1.0.0",
        schema: {},
        requiredFields: ["executionId"],
        producerIds: ["kernel:orchestrator"],
        consumerIds: ["kernel:execution"],
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-contract:query.runtime-status",
        name: "kernel.runtime-status",
        kind: "query",
        version: "1.0.0",
        schema: {},
        requiredFields: [],
        producerIds: ["kernel:api"],
        consumerIds: ["kernel:runtime"],
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const contract of contracts) {
      this.contracts.set(contract.id, contract);
    }
  }
}
