import { Injectable, NotFoundException } from "@nestjs/common";
import { EventContractDefinition } from "../foundation-pack-6.types";

@Injectable()
export class EventContractRegistryService {
  private readonly contracts = new Map<string, EventContractDefinition>([
    [
      "event-contract:avos.orchestration.requested:1.0.0",
      {
        id: "event-contract:avos.orchestration.requested:1.0.0",
        eventType: "avos.orchestration.requested",
        version: "1.0.0",
        description:
          "Signals that a governed autonomous orchestration plan has been requested.",
        producerCapabilityIds: ["capability:autonomous-orchestration"],
        consumerCapabilityIds: [
          "capability:orchestration-runtime",
          "capability:human-approval"
        ],
        requiredPayloadFields: ["planId", "objective"],
        sensitivePayloadFields: [],
        retentionClass: "audit",
        requiresTraceability: true,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    [
      "event-contract:avos.human-approval.requested:1.0.0",
      {
        id: "event-contract:avos.human-approval.requested:1.0.0",
        eventType: "avos.human-approval.requested",
        version: "1.0.0",
        description:
          "Signals that autonomous execution is paused for final human authority.",
        producerCapabilityIds: ["capability:human-approval"],
        consumerCapabilityIds: [
          "capability:approval-center",
          "capability:audit"
        ],
        requiredPayloadFields: ["approvalRequestId", "planId", "stepId"],
        sensitivePayloadFields: [],
        retentionClass: "permanent",
        requiresTraceability: true,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  ]);

  list() {
    return Array.from(this.contracts.values());
  }

  get(id: string) {
    const contract = this.contracts.get(id);

    if (!contract) {
      throw new NotFoundException(`Event contract not found: ${id}`);
    }

    return contract;
  }

  find(eventType: string, version: string) {
    return this.list().find(
      (contract) =>
        contract.eventType === eventType &&
        contract.version === version &&
        contract.active
    );
  }

  register(
    input: Omit<EventContractDefinition, "createdAt" | "updatedAt">
  ) {
    const now = new Date().toISOString();

    const contract: EventContractDefinition = {
      ...input,
      producerCapabilityIds: Array.from(
        new Set(input.producerCapabilityIds)
      ),
      consumerCapabilityIds: Array.from(
        new Set(input.consumerCapabilityIds)
      ),
      requiredPayloadFields: Array.from(
        new Set(input.requiredPayloadFields)
      ),
      sensitivePayloadFields: Array.from(
        new Set(input.sensitivePayloadFields)
      ),
      createdAt: now,
      updatedAt: now
    };

    this.contracts.set(contract.id, contract);
    return contract;
  }

  validatePayload(
    eventType: string,
    version: string,
    payload: Record<string, unknown>
  ) {
    const contract = this.find(eventType, version);

    if (!contract) {
      return {
        valid: false,
        contractFound: false,
        missingFields: [] as string[]
      };
    }

    const missingFields = contract.requiredPayloadFields.filter(
      (field) => payload[field] === undefined
    );

    return {
      valid: missingFields.length === 0,
      contractFound: true,
      contractId: contract.id,
      missingFields
    };
  }

  summary() {
    const contracts = this.list();

    return {
      total: contracts.length,
      active: contracts.filter((contract) => contract.active).length,
      traceable: contracts.filter(
        (contract) => contract.requiresTraceability
      ).length
    };
  }
}
