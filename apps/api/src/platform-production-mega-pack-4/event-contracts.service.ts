import { Injectable } from "@nestjs/common";
import { EventContract, EventEnvelope } from "./platform-production-mega-pack-4.types";
import { EventRegistryService } from "./event-registry.service";

@Injectable()
export class EventContractsService {
  constructor(
    private readonly registry: EventRegistryService,
  ) {}

  register(
    input: Omit<EventContract, "id" | "createdAt" | "updatedAt">,
  ): EventContract {
    return this.registry.registerContract(input);
  }

  list(): EventContract[] {
    return this.registry.listContracts();
  }

  validate(envelope: EventEnvelope): {
    valid: boolean;
    contract: EventContract;
    missingFields: string[];
  } {
    const contract = this.registry.resolve(
      envelope.eventType,
      envelope.version,
    );

    const requiredFields = Object.keys(contract.schema);
    const missingFields = requiredFields.filter(
      (field) => !(field in envelope.payload),
    );

    return {
      valid: missingFields.length === 0,
      contract,
      missingFields,
    };
  }
}