import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  EVENT_CODE_PREFIX,
  MEGA_PACK_6_COLLECTIONS,
} from "./constants/mega-pack-6.constants";
import { PublishPlatformEventDto } from "./dto/publish-platform-event.dto";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import {
  PlatformEvent,
} from "./types/mega-pack-6.types";

@Injectable()
export class PlatformEventBusService {
  constructor(
    private readonly storage:
      MegaPack6StorageService,
    private readonly sequence:
      EnterpriseSequenceService,
  ) {}

  async publish(
    dto: PublishPlatformEventDto,
  ): Promise<PlatformEvent> {
    const now = new Date().toISOString();

    const event: PlatformEvent = {
      id: randomUUID(),
      eventCode: this.sequence.next(
        EVENT_CODE_PREFIX,
      ),
      eventType: dto.eventType,
      source: dto.source,
      severity: dto.severity,
      entityReference:
        dto.entityType && dto.entityId
          ? {
              entityType: dto.entityType,
              entityId: dto.entityId,
            }
          : undefined,
      payload: dto.payload,
      correlationId:
        dto.correlationId,
      causationId:
        dto.causationId,
      occurredAt: now,
      processingStatus: "pending",
      retryCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    return this.storage.append(
      MEGA_PACK_6_COLLECTIONS.platformEvents,
      event,
    );
  }

  async list(
    status?: PlatformEvent["processingStatus"],
    eventType?: string,
  ): Promise<PlatformEvent[]> {
    const events =
      await this.storage.readCollection<PlatformEvent>(
        MEGA_PACK_6_COLLECTIONS.platformEvents,
      );

    return events
      .filter(
        (event) =>
          (!status ||
            event.processingStatus ===
              status) &&
          (!eventType ||
            event.eventType === eventType),
      )
      .sort((a, b) =>
        b.occurredAt.localeCompare(
          a.occurredAt,
        ),
      );
  }

  async markProcessing(
    id: string,
  ): Promise<PlatformEvent> {
    return this.updateStatus(
      id,
      "processing",
    );
  }

  async markProcessed(
    id: string,
  ): Promise<PlatformEvent> {
    return this.updateStatus(
      id,
      "processed",
    );
  }

  async markFailed(
    id: string,
    errorMessage: string,
  ): Promise<PlatformEvent> {
    const existing =
      await this.storage.findById<PlatformEvent>(
        MEGA_PACK_6_COLLECTIONS.platformEvents,
        id,
      );

    if (!existing) {
      throw new NotFoundException(
        `Platform event ${id} was not found`,
      );
    }

    const now = new Date().toISOString();

    const updated: PlatformEvent = {
      ...existing,
      processingStatus: "failed",
      retryCount:
        existing.retryCount + 1,
      errorMessage,
      updatedAt: now,
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.platformEvents,
      id,
      updated,
    );

    return updated;
  }

  async pendingCount(): Promise<number> {
    const events = await this.list(
      "pending",
    );

    return events.length;
  }

  private async updateStatus(
    id: string,
    processingStatus:
      PlatformEvent["processingStatus"],
  ): Promise<PlatformEvent> {
    const existing =
      await this.storage.findById<PlatformEvent>(
        MEGA_PACK_6_COLLECTIONS.platformEvents,
        id,
      );

    if (!existing) {
      throw new NotFoundException(
        `Platform event ${id} was not found`,
      );
    }

    const now = new Date().toISOString();

    const updated: PlatformEvent = {
      ...existing,
      processingStatus,
      processedAt:
        processingStatus === "processed"
          ? now
          : existing.processedAt,
      updatedAt: now,
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.platformEvents,
      id,
      updated,
    );

    return updated;
  }
}
