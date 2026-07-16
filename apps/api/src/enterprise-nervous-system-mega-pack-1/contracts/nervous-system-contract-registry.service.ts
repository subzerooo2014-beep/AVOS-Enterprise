import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { NervousSystemEventContract } from "../enterprise-nervous-system-mega-pack-1.types";
import { NervousSystemAuditService } from "../observability/nervous-system-audit.service";

@Injectable()
export class NervousSystemContractRegistryService {
  private readonly contracts =
    new Map<string, NervousSystemEventContract>();

  constructor(
    private readonly audit: NervousSystemAuditService
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
        `Nervous System event contract not found: ${id}`
      );
    }

    return contract;
  }

  register(
    input: Omit<
      NervousSystemEventContract,
      "createdAt" | "updatedAt"
    >,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.contracts.has(input.id)) {
      throw new ConflictException(
        `Nervous System event contract already exists: ${input.id}`
      );
    }

    if (!/^\d+\.\d+\.\d+$/.test(input.version)) {
      throw new ConflictException(
        `Invalid event contract version: ${input.version}`
      );
    }

    const now = new Date().toISOString();

    const contract: NervousSystemEventContract = {
      ...input,
      requiredHeaders:
        Array.from(new Set(input.requiredHeaders)),
      producerIds:
        Array.from(new Set(input.producerIds)),
      consumerIds:
        Array.from(new Set(input.consumerIds)),
      createdAt: now,
      updatedAt: now
    };

    this.contracts.set(contract.id, contract);

    this.audit.record({
      correlationId: context.correlationId,
      category: "contract",
      action: "nervous-system-contract-registered",
      subjectId: contract.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        version: contract.version,
        topic: contract.topic
      }
    });

    return contract;
  }

  validateEnvelope(input: {
    contractId: string;
    topic: string;
    producerId: string;
    headers: Record<string, string>;
  }) {
    const contract = this.get(input.contractId);

    const checks = {
      contractActive: contract.active,
      topicMatches: contract.topic === input.topic,
      producerAllowed:
        contract.producerIds.length === 0 ||
        contract.producerIds.includes(input.producerId),
      requiredHeadersPresent:
        contract.requiredHeaders.every(
          (header) => Boolean(input.headers[header])
        ),
      traceable: contract.traceable
    };

    return {
      valid: Object.values(checks).every(Boolean),
      checks
    };
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      active: items.filter((x) => x.active).length,
      traceable: items.filter((x) => x.traceable).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const contracts: NervousSystemEventContract[] = [
      {
        id: "nervous-contract:platform-event",
        name: "AVOS Platform Event",
        version: "1.0.0",
        topic: "avos.platform.events",
        description:
          "Generic governed event contract for AVOS platform events.",
        payloadSchema: {
          type: "object"
        },
        requiredHeaders: [
          "x-avos-correlation-id",
          "x-avos-trace-id"
        ],
        producerIds: [],
        consumerIds: [],
        active: true,
        traceable: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "nervous-contract:brain-decision-event",
        name: "Enterprise Brain Decision Event",
        version: "1.0.0",
        topic: "avos.brain.decisions",
        description:
          "Decision lifecycle event emitted by Enterprise Brain.",
        payloadSchema: {
          type: "object",
          required: ["decisionId", "status"]
        },
        requiredHeaders: [
          "x-avos-correlation-id",
          "x-avos-trace-id"
        ],
        producerIds: [
          "producer:enterprise-brain"
        ],
        consumerIds: [],
        active: true,
        traceable: true,
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const contract of contracts) {
      this.contracts.set(contract.id, contract);
    }
  }
}
