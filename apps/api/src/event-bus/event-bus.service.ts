import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EventDispatcherService } from "./dispatcher/event-dispatcher.service";
import { AvosEvent } from "./contracts/avos-event.interface";

@Injectable()
export class EventBusService {
  constructor(
    private prisma: PrismaService,
    private dispatcher: EventDispatcherService,
  ) {}

  async publish(type: string, payload: any = {}) {
    const event = await this.emit({
      type,
      source: payload?.source || "application-flow",
      entityType: payload?.entityType,
      entityId: payload?.entityId,
      payload,
      metadata: payload?.metadata || {},
      correlationId: payload?.correlationId,
    });

    void this.dispatcher.dispatch(event);

    return event;
  }

  async emit(data: AvosEvent) {
    return (this.prisma as any).platformEvent.create({
      data: {
        type: data.type,
        source: data.source || "api",
        entityType: data.entityType,
        entityId: data.entityId,
        status: "new",
        payload: data.payload || {},
        result: {
          metadata: data.metadata || {},
          correlationId: data.correlationId || null,
          message: "Event received by AVOS Event Bus.",
        },
      },
    });
  }

  list(status?: string) {
    return (this.prisma as any).platformEvent.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
    });
  }

  async markProcessed(id: string, result: any = {}) {
    const event = await (this.prisma as any).platformEvent.findUnique({ where: { id } });
    if (!event) throw new NotFoundException("Platform event not found");

    return (this.prisma as any).platformEvent.update({
      where: { id },
      data: {
        status: "processed",
        result: {
          ...(event.result || {}),
          ...result,
          processedAt: new Date().toISOString(),
        },
      },
    });
  }
}
