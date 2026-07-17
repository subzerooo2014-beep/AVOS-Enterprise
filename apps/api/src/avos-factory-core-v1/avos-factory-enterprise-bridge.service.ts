import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryIntegrationEvent,
  AvosFactoryIntegrationTarget
} from "./avos-factory-integration.contracts";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";
import {
  AvosFactoryDigitalDNAService
} from "./avos-factory-digital-dna.service";
import {
  AvosFactoryIntegrationRegistryService
} from "./avos-factory-integration-registry.service";
import {
  AvosFactoryLivingBlueprintService
} from "./avos-factory-living-blueprint.service";

@Injectable()
export class AvosFactoryEnterpriseBridgeService {
  private readonly events:
    AvosFactoryIntegrationEvent[] = [];

  constructor(
    private readonly registry:
      AvosFactoryIntegrationRegistryService,
    private readonly blueprint:
      AvosFactoryLivingBlueprintService,
    private readonly digitalDNA:
      AvosFactoryDigitalDNAService,
    private readonly audit:
      AvosFactoryAuditService
  ) {}

  connect(input: {
    target: AvosFactoryIntegrationTarget;
    actor: string;
    humanApproved: boolean;
    approvedBy: string;
    payload?: Record<string, unknown>;
  }) {
    if (
      input.humanApproved !== true ||
      !input.approvedBy?.trim()
    ) {
      throw new BadRequestException(
        "Enterprise integration requires Human Final Authority approval."
      );
    }

    const integration =
      this.registry.markConnected(
        input.target
      );

    const event: AvosFactoryIntegrationEvent = {
      id: randomUUID(),
      target: input.target,
      action: "integration-connected",
      actor: input.actor,
      payload:
        structuredClone(
          input.payload ?? {}
        ),
      humanApproved: true,
      approvedBy:
        input.approvedBy,
      createdAt:
        new Date().toISOString()
    };

    this.events.unshift(event);

    this.audit.append({
      category: "operations",
      action: "factory-enterprise-integration-connected",
      actor: input.actor,
      approvedBy:
        input.approvedBy,
      success: true,
      resourceId:
        input.target,
      details: {
        integrationStatus:
          integration.status,
        detectedPaths:
          integration.detectedPaths
      }
    });

    return {
      integration,
      event
    };
  }

  bootstrap(input: {
    actor: string;
    humanApproved: boolean;
    approvedBy: string;
  }) {
    if (
      input.humanApproved !== true ||
      !input.approvedBy?.trim()
    ) {
      throw new BadRequestException(
        "Factory enterprise bootstrap requires Human Final Authority approval."
      );
    }

    const registry =
      this.registry.refresh();

    const blueprint =
      this.blueprint.register();

    const digitalDNA =
      this.digitalDNA.generate();

    this.audit.append({
      category: "operations",
      action: "factory-enterprise-bootstrap-completed",
      actor: input.actor,
      approvedBy:
        input.approvedBy,
      success: true,
      resourceId:
        "AVOS Factory Core V1",
      details: {
        connectedCount:
          registry.connectedCount,
        availableCount:
          registry.availableCount,
        missingCount:
          registry.missingCount,
        blueprintId:
          blueprint.id,
        digitalDNAId:
          digitalDNA.id
      }
    });

    return {
      registry,
      blueprint,
      digitalDNA,
      humanFinalAuthority: true
    };
  }

  listEvents(limit = 100):
    AvosFactoryIntegrationEvent[] {
    return this.events
      .slice(
        0,
        Math.max(
          1,
          Math.min(limit, 1000)
        )
      )
      .map((event) =>
        structuredClone(event)
      );
  }
}
