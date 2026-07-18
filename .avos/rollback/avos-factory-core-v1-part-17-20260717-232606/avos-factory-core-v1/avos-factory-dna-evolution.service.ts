import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryDNAEvolutionRecord
} from "./avos-factory-synchronization.contracts";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";
import {
  AvosFactoryDigitalDNAService
} from "./avos-factory-digital-dna.service";
import {
  AvosFactoryEventBusService
} from "./avos-factory-event-bus.service";

@Injectable()
export class AvosFactoryDNAEvolutionService {
  private latestRecord?:
    AvosFactoryDNAEvolutionRecord;

  constructor(
    private readonly digitalDNA:
      AvosFactoryDigitalDNAService,
    private readonly events:
      AvosFactoryEventBusService,
    private readonly audit:
      AvosFactoryAuditService
  ) {}

  evolve(input: {
    actor: string;
    approvedBy: string;
    humanApproved: boolean;
  }): AvosFactoryDNAEvolutionRecord {
    if (
      input.humanApproved !== true ||
      !input.approvedBy?.trim()
    ) {
      throw new BadRequestException(
        "Digital DNA evolution requires Human Final Authority approval."
      );
    }

    const dna =
      this.digitalDNA.latest() ??
      this.digitalDNA.generate();

    const record: AvosFactoryDNAEvolutionRecord = {
      id: randomUUID(),
      dnaId: dna.id,
      previousVersion: "1.0.0",
      currentVersion: "1.0.1",
      evolutionType:
        "enterprise-integration",
      changes: [
        "Added enterprise event integration.",
        "Added Capability Fabric publication.",
        "Added Knowledge Fabric publication.",
        "Added Living Blueprint synchronization.",
        "Added governed Digital DNA evolution.",
        "Preserved Human Final Authority."
      ],
      approvedBy:
        input.approvedBy,
      humanApproved: true,
      evolvedAt:
        new Date().toISOString()
    };

    this.latestRecord =
      structuredClone(record);

    const event =
      this.events.publish({
        type:
          "factory.integration.synchronized",
        actor:
          input.actor,
        approvedBy:
          input.approvedBy,
        humanApproved: true,
        correlationId:
          randomUUID(),
        subjectId:
          record.dnaId,
        payload: {
          target:
            "digital-dna",
          evolutionId:
            record.id,
          currentVersion:
            record.currentVersion
        }
      });

    this.audit.append({
      category: "operations",
      action:
        "factory-digital-dna-evolved",
      actor:
        input.actor,
      approvedBy:
        input.approvedBy,
      success: true,
      correlationId:
        event.correlationId,
      resourceId:
        record.dnaId,
      details: {
        evolutionId:
          record.id,
        currentVersion:
          record.currentVersion
      }
    });

    return record;
  }

  latest():
    | AvosFactoryDNAEvolutionRecord
    | undefined {
    return this.latestRecord
      ? structuredClone(this.latestRecord)
      : undefined;
  }
}
