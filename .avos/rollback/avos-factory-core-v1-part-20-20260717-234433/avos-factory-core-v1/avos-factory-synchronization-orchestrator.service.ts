import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactorySynchronizationRecord,
  AvosFactorySynchronizationReport,
  AvosFactorySyncTarget
} from "./avos-factory-synchronization.contracts";
import {
  AvosFactoryBlueprintSyncService
} from "./avos-factory-blueprint-sync.service";
import {
  AvosFactoryCapabilityPublisherService
} from "./avos-factory-capability-publisher.service";
import {
  AvosFactoryDNAEvolutionService
} from "./avos-factory-dna-evolution.service";
import {
  AvosFactoryEventBusService
} from "./avos-factory-event-bus.service";
import {
  AvosFactoryKnowledgePublisherService
} from "./avos-factory-knowledge-publisher.service";

@Injectable()
export class AvosFactorySynchronizationOrchestratorService {
  private readonly records:
    AvosFactorySynchronizationRecord[] = [];

  constructor(
    private readonly capabilities:
      AvosFactoryCapabilityPublisherService,
    private readonly knowledge:
      AvosFactoryKnowledgePublisherService,
    private readonly blueprint:
      AvosFactoryBlueprintSyncService,
    private readonly dna:
      AvosFactoryDNAEvolutionService,
    private readonly events:
      AvosFactoryEventBusService
  ) {}

  synchronizeAll(input: {
    actor: string;
    approvedBy: string;
    humanApproved: boolean;
  }): AvosFactorySynchronizationReport {
    if (
      input.humanApproved !== true ||
      !input.approvedBy?.trim()
    ) {
      throw new BadRequestException(
        "Enterprise synchronization requires Human Final Authority approval."
      );
    }

    const capabilityRegistration =
      this.runTarget(
        "capability-fabric",
        input,
        () =>
          this.capabilities.publish(input)
      );

    const knowledgePublication =
      this.runTarget(
        "knowledge-fabric",
        input,
        () =>
          this.knowledge.publish(input)
      );

    const blueprintSync =
      this.runTarget(
        "living-blueprint",
        input,
        () =>
          this.blueprint.synchronize(input)
      );

    const dnaEvolution =
      this.runTarget(
        "digital-dna",
        input,
        () =>
          this.dna.evolve(input)
      );

    const checks = {
      capabilityFabricSynchronized:
        capabilityRegistration.status ===
        "synchronized",
      knowledgeFabricSynchronized:
        knowledgePublication.status ===
        "synchronized",
      livingBlueprintSynchronized:
        blueprintSync.status ===
        "synchronized",
      digitalDNAEvolved:
        dnaEvolution.status ===
        "synchronized",
      eventsPublished:
        this.events.count() >= 4,
      humanFinalAuthority:
        input.humanApproved === true &&
        Boolean(input.approvedBy)
    };

    const blockingFindings =
      Object.entries(checks)
        .filter(([, passed]) => !passed)
        .map(([name]) => name);

    const score = Math.round(
      (
        Object.values(checks)
          .filter(Boolean)
          .length /
        Object.keys(checks).length
      ) * 100
    );

    return {
      id: randomUUID(),
      passed:
        blockingFindings.length === 0 &&
        score === 100,
      score,
      checks,
      eventCount:
        this.events.count(),
      synchronizationCount:
        this.records.filter(
          (record) =>
            record.status ===
            "synchronized"
        ).length,
      capabilityRegistration:
        capabilityRegistration.response as
          | ReturnType<
              AvosFactoryCapabilityPublisherService["publish"]
            >
          | undefined,
      knowledgePublication:
        knowledgePublication.response as
          | ReturnType<
              AvosFactoryKnowledgePublisherService["publish"]
            >
          | undefined,
      blueprintSync:
        blueprintSync.response as
          | ReturnType<
              AvosFactoryBlueprintSyncService["synchronize"]
            >
          | undefined,
      dnaEvolution:
        dnaEvolution.response as
          | ReturnType<
              AvosFactoryDNAEvolutionService["evolve"]
            >
          | undefined,
      blockingFindings,
      generatedAt:
        new Date().toISOString()
    };
  }

  list(limit = 100):
    AvosFactorySynchronizationRecord[] {
    return this.records
      .slice(
        0,
        Math.max(
          1,
          Math.min(limit, 1000)
        )
      )
      .map((record) =>
        structuredClone(record)
      );
  }

  private runTarget<T>(
    target: AvosFactorySyncTarget,
    input: {
      actor: string;
      approvedBy: string;
      humanApproved: boolean;
    },
    operation: () => T
  ): AvosFactorySynchronizationRecord {
    const eventId =
      randomUUID();

    const record: AvosFactorySynchronizationRecord = {
      id: randomUUID(),
      target,
      status: "pending",
      eventId,
      subjectId:
        "AVOS Factory Core V1",
      actor:
        input.actor,
      approvedBy:
        input.approvedBy,
      attempt: 1,
      createdAt:
        new Date().toISOString()
    };

    try {
      const response =
        operation();

      record.status =
        "synchronized";
      record.response =
        structuredClone(response);
      record.synchronizedAt =
        new Date().toISOString();
    } catch (error) {
      record.status = "failed";
      record.error =
        error instanceof Error
          ? error.message
          : String(error);
    }

    this.records.unshift(
      structuredClone(record)
    );

    return record;
  }
}
