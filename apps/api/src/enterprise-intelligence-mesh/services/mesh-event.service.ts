import { Injectable } from "@nestjs/common";
import type { MeshEvent } from "../contracts/enterprise-intelligence-mesh.contracts";
import type { PublishMeshEventDto } from "../dto/enterprise-intelligence-mesh.dto";
import { MeshIdService } from "./mesh-id.service";

@Injectable()
export class MeshEventService {
  private readonly events: MeshEvent[] = [];

  constructor(private readonly ids: MeshIdService) {}

  publish(dto: PublishMeshEventDto): MeshEvent {
    const event: MeshEvent = {
      id: this.ids.create(),
      topic: dto.topic,
      type: dto.type,
      source: dto.source,
      payload: { ...(dto.payload ?? {}) },
      context: {
        correlationId: dto.context.correlationId ?? this.ids.create(),
        causationId: dto.context.causationId,
        traceId: dto.context.traceId ?? this.ids.create(),
        source: dto.context.source,
        priority: dto.context.priority ?? "normal",
        identity: {
          tenantId: dto.context.identity.tenantId,
          actorId: dto.context.identity.actorId,
          actorType: dto.context.identity.actorType,
          roles: [...dto.context.identity.roles]
        },
        metadata: { ...(dto.context.metadata ?? {}) }
      },
      createdAt: this.ids.now()
    };

    this.events.push(event);
    return event;
  }

  list(topic?: string): MeshEvent[] {
    return this.events
      .filter((event) => !topic || event.topic === topic)
      .slice()
      .reverse();
  }

  count(): number {
    return this.events.length;
  }
}