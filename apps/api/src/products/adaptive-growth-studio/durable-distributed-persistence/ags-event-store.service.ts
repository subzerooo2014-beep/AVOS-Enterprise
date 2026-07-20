import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { AgsDurableIdService } from "./ags-durable-id.service";

@Injectable()
export class AgsEventStoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ids: AgsDurableIdService,
  ) {}

  append(input: {
    streamId: string;
    streamType: string;
    eventType: string;
    payload: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    topic?: string;
  }) {
    return (this.prisma as any).$transaction(async (tx: any) => {
      const aggregate = await tx.agsEventRecord.aggregate({
        where: { streamId: input.streamId },
        _max: { sequence: true },
      });

      const sequence = Number(aggregate?._max?.sequence ?? 0) + 1;
      const eventId = this.ids.create("ags-event");

      const event = await tx.agsEventRecord.create({
        data: {
          id: eventId,
          streamId: input.streamId,
          streamType: input.streamType,
          eventType: input.eventType,
          sequence,
          payload: input.payload,
          metadata: input.metadata ?? {},
        },
      });

      await tx.agsOutboxMessage.create({
        data: {
          id: this.ids.create("ags-outbox"),
          topic: input.topic ?? "avos.ags.events",
          eventType: input.eventType,
          payload: {
            eventId,
            streamId: input.streamId,
            streamType: input.streamType,
            sequence,
            data: input.payload,
          },
          headers: {
            source: "adaptive-growth-studio",
            schemaVersion: "1.0",
          },
        },
      });

      return event;
    });
  }

  readStream(streamId: string) {
    return (this.prisma as any).agsEventRecord.findMany({
      where: { streamId },
      orderBy: { sequence: "asc" },
    });
  }

  recent(limit = 100) {
    return (this.prisma as any).agsEventRecord.findMany({
      orderBy: { createdAt: "desc" },
      take: Math.min(Math.max(limit, 1), 500),
    });
  }
}