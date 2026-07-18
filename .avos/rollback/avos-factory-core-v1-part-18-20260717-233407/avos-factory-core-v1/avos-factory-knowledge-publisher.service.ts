import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryKnowledgePublication
} from "./avos-factory-synchronization.contracts";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";
import {
  AvosFactoryEventBusService
} from "./avos-factory-event-bus.service";
import {
  AvosFactoryIntegrationRegistryService
} from "./avos-factory-integration-registry.service";

@Injectable()
export class AvosFactoryKnowledgePublisherService {
  private latestRecord?:
    AvosFactoryKnowledgePublication;

  constructor(
    private readonly registry:
      AvosFactoryIntegrationRegistryService,
    private readonly events:
      AvosFactoryEventBusService,
    private readonly audit:
      AvosFactoryAuditService
  ) {}

  publish(input: {
    actor: string;
    approvedBy: string;
    humanApproved: boolean;
  }): AvosFactoryKnowledgePublication {
    if (
      input.humanApproved !== true ||
      !input.approvedBy?.trim()
    ) {
      throw new BadRequestException(
        "Knowledge publication requires Human Final Authority approval."
      );
    }

    const registry =
      this.registry.getRegistry();

    const knowledgeFabric =
      registry.integrations.find(
        (item) =>
          item.target === "knowledge-fabric"
      );

    if (
      !knowledgeFabric ||
      knowledgeFabric.status === "not-detected"
    ) {
      throw new BadRequestException(
        "Knowledge Fabric is not available."
      );
    }

    const record: AvosFactoryKnowledgePublication = {
      id: randomUUID(),
      knowledgeType:
        "architecture-and-runtime",
      title:
        "AVOS Factory Core V1 Knowledge",
      version: "1.0.0",
      topics: [
        "factory-architecture",
        "blueprint-engine",
        "code-generation",
        "template-engine",
        "ai-generator",
        "project-generation",
        "project-execution",
        "operational-governance",
        "rollback",
        "verification",
        "certification",
        "enterprise-integration"
      ],
      provenance: {
        source:
          "AVOS Factory Core V1",
        generatedBy:
          "avos-factory:knowledge-publisher",
        humanApproved: true,
        approvedBy:
          input.approvedBy
      },
      publishedAt:
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
          record.id,
        payload: {
          target:
            "knowledge-fabric",
          knowledgeType:
            record.knowledgeType,
          version:
            record.version
        }
      });

    this.audit.append({
      category: "operations",
      action:
        "factory-knowledge-published",
      actor:
        input.actor,
      approvedBy:
        input.approvedBy,
      success: true,
      correlationId:
        event.correlationId,
      resourceId:
        record.id,
      details: {
        topicCount:
          record.topics.length
      }
    });

    return record;
  }

  latest():
    | AvosFactoryKnowledgePublication
    | undefined {
    return this.latestRecord
      ? structuredClone(this.latestRecord)
      : undefined;
  }
}
