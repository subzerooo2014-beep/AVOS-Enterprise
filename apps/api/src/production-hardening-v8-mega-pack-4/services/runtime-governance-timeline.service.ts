import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceJsonValue,
  GovernanceTimelineEvent,
} from "../contracts";
import {
  CreateGovernanceTimelineEventDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";

@Injectable()
export class RuntimeGovernanceTimelineService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
  ) {}

  append(
    dto:
      CreateGovernanceTimelineEventDto,
  ): GovernanceTimelineEvent {
    const existing =
      this.store
        .listGovernanceTimeline();

    const event:
      GovernanceTimelineEvent = {
      id:
        randomUUID(),
      sequence:
        existing.length + 1,
      aggregateType:
        dto.aggregateType,
      aggregateId:
        dto.aggregateId,
      type:
        dto.type,
      title:
        dto.title,
      description:
        dto.description,
      actor:
        dto.actor,
      relatedResourceIds:
        dto.relatedResourceIds ?? [],
      payload:
        (dto.payload ?? {}) as Record<
          string,
          GovernanceJsonValue
        >,
      metadata:
        (dto.metadata ?? {}) as Record<
          string,
          GovernanceJsonValue
        >,
      createdAt:
        new Date().toISOString(),
    };

    return this.store
      .appendGovernanceTimelineEvent(
        event,
      );
  }

  list(filters?: {
    aggregateType?: string;
    aggregateId?: string;
  }): GovernanceTimelineEvent[] {
    return this.store
      .listGovernanceTimeline()
      .filter(
        (event) =>
          (
            !filters?.aggregateType ||
            event.aggregateType ===
              filters.aggregateType
          ) &&
          (
            !filters?.aggregateId ||
            event.aggregateId ===
              filters.aggregateId
          ),
      );
  }
}
