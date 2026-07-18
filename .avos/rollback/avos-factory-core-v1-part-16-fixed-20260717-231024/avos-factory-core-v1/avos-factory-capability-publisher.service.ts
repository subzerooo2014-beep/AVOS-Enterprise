import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryCapabilityRegistration
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
export class AvosFactoryCapabilityPublisherService {
  private latestRecord?:
    AvosFactoryCapabilityRegistration;

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
  }): AvosFactoryCapabilityRegistration {
    if (
      input.humanApproved !== true ||
      !input.approvedBy?.trim()
    ) {
      throw new BadRequestException(
        "Capability publication requires Human Final Authority approval."
      );
    }

    const registry =
      this.registry.getRegistry();

    const capabilityFabric =
      registry.integrations.find(
        (item) =>
          item.target === "capability-fabric"
      );

    if (
      !capabilityFabric ||
      capabilityFabric.status === "not-detected"
    ) {
      throw new BadRequestException(
        "Capability Fabric is not available."
      );
    }

    const record: AvosFactoryCapabilityRegistration = {
      id: randomUUID(),
      capabilityId:
        "avos.factory.core.v1",
      name:
        "AVOS Factory Core V1",
      version: "1.0.0",
      lifecycle:
        "platform-service",
      status: "certified",
      contracts: [
        "blueprint-generation",
        "code-generation",
        "template-resolution",
        "ai-assisted-generation",
        "project-generation",
        "controlled-execution",
        "rollback",
        "verification",
        "certification"
      ],
      dependencies: [
        "enterprise-kernel",
        "capability-fabric",
        "knowledge-fabric"
      ],
      policies: [
        "foundation-first",
        "capability-first",
        "blueprint-driven",
        "human-final-authority",
        "audit-by-design"
      ],
      humanFinalAuthority: true,
      registeredAt:
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
          record.capabilityId,
        payload: {
          target:
            "capability-fabric",
          registrationId:
            record.id,
          version:
            record.version
        }
      });

    this.audit.append({
      category: "operations",
      action:
        "factory-capability-published",
      actor:
        input.actor,
      approvedBy:
        input.approvedBy,
      success: true,
      correlationId:
        event.correlationId,
      resourceId:
        record.capabilityId,
      details: {
        registrationId:
          record.id
      }
    });

    return record;
  }

  latest():
    | AvosFactoryCapabilityRegistration
    | undefined {
    return this.latestRecord
      ? structuredClone(this.latestRecord)
      : undefined;
  }
}
