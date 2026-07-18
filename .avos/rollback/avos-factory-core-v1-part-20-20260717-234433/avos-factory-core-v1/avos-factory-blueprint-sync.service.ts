import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryBlueprintSyncRecord
} from "./avos-factory-synchronization.contracts";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";
import {
  AvosFactoryEventBusService
} from "./avos-factory-event-bus.service";
import {
  AvosFactoryLivingBlueprintService
} from "./avos-factory-living-blueprint.service";

@Injectable()
export class AvosFactoryBlueprintSyncService {
  private latestRecord?:
    AvosFactoryBlueprintSyncRecord;

  constructor(
    private readonly blueprint:
      AvosFactoryLivingBlueprintService,
    private readonly events:
      AvosFactoryEventBusService,
    private readonly audit:
      AvosFactoryAuditService
  ) {}

  synchronize(input: {
    actor: string;
    approvedBy: string;
    humanApproved: boolean;
  }): AvosFactoryBlueprintSyncRecord {
    if (
      input.humanApproved !== true ||
      !input.approvedBy?.trim()
    ) {
      throw new BadRequestException(
        "Living Blueprint synchronization requires Human Final Authority approval."
      );
    }

    const blueprint =
      this.blueprint.latest() ??
      this.blueprint.register();

    const record: AvosFactoryBlueprintSyncRecord = {
      id: randomUUID(),
      blueprintId:
        blueprint.id,
      version: "1.0.0",
      synchronizedComponents: [
        ...blueprint.architectureLayers,
        ...blueprint.capabilities
      ],
      runtimeState: "healthy",
      humanFinalAuthority: true,
      synchronizedAt:
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
          record.blueprintId,
        payload: {
          target:
            "living-blueprint",
          synchronizationId:
            record.id,
          componentCount:
            record.synchronizedComponents.length
        }
      });

    this.audit.append({
      category: "operations",
      action:
        "factory-living-blueprint-synchronized",
      actor:
        input.actor,
      approvedBy:
        input.approvedBy,
      success: true,
      correlationId:
        event.correlationId,
      resourceId:
        record.blueprintId,
      details: {
        synchronizationId:
          record.id,
        componentCount:
          record.synchronizedComponents.length
      }
    });

    return record;
  }

  latest():
    | AvosFactoryBlueprintSyncRecord
    | undefined {
    return this.latestRecord
      ? structuredClone(this.latestRecord)
      : undefined;
  }
}
