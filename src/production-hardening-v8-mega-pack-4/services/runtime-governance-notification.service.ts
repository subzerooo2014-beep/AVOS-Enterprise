import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceJsonValue,
  GovernanceNotification,
  GovernanceNotificationStatus,
  GovernanceTimelineEventType,
} from "../contracts";
import {
  CreateGovernanceNotificationDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeGovernanceTimelineService,
} from "./runtime-governance-timeline.service";

@Injectable()
export class RuntimeGovernanceNotificationService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly timeline:
      RuntimeGovernanceTimelineService,
  ) {}

  create(
    dto:
      CreateGovernanceNotificationDto,
  ): GovernanceNotification {
    if (
      dto.deduplicationKey
    ) {
      const duplicate =
        this.store
          .listGovernanceNotifications()
          .find(
            (item) =>
              item.deduplicationKey ===
                dto.deduplicationKey &&
              ![
                GovernanceNotificationStatus.FAILED,
                GovernanceNotificationStatus.CANCELLED,
                GovernanceNotificationStatus.SUPPRESSED,
              ].includes(item.status),
          );

      if (duplicate) {
        throw new BadRequestException(
          `Active notification already exists for deduplication key ${dto.deduplicationKey}`,
        );
      }
    }

    const notification:
      GovernanceNotification = {
      id:
        randomUUID(),
      notificationNumber:
        this.nextNotificationNumber(),
      status:
        GovernanceNotificationStatus.PENDING,
      channel:
        dto.channel,
      subject:
        dto.subject,
      message:
        dto.message,
      recipients:
        dto.recipients,
      escalationId:
        dto.escalationId,
      governanceRequestId:
        dto.governanceRequestId,
      decisionRecordId:
        dto.decisionRecordId,
      changeExecutionId:
        dto.changeExecutionId,
      scheduleRunId:
        dto.scheduleRunId,
      priority:
        dto.priority,
      deduplicationKey:
        dto.deduplicationKey,
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
      createdBy:
        dto.actor,
      createdAt:
        new Date().toISOString(),
    };

    return this.store
      .saveGovernanceNotification(
        notification,
      );
  }

  send(
    id: string,
    actor: {
      id: string;
      type:
        | "user"
        | "service"
        | "system"
        | "automation";
      name?: string;
      roles: string[];
    },
  ): GovernanceNotification {
    const notification =
      this.get(id);

    if (
      ![
        GovernanceNotificationStatus.PENDING,
        GovernanceNotificationStatus.QUEUED,
        GovernanceNotificationStatus.FAILED,
      ].includes(notification.status)
    ) {
      throw new BadRequestException(
        `Notification cannot be sent from status ${notification.status}`,
      );
    }

    notification.status =
      GovernanceNotificationStatus.SENT;

    notification.queuedAt =
      notification.queuedAt ??
      new Date().toISOString();

    notification.sentAt =
      new Date().toISOString();

    notification.error =
      undefined;

    const saved =
      this.store
        .saveGovernanceNotification(
          notification,
        );

    this.timeline.append({
      aggregateType:
        "governance_notification",
      aggregateId:
        saved.id,
      type:
        GovernanceTimelineEventType.NOTIFICATION_SENT,
      title:
        `Notification sent: ${saved.subject}`,
      description:
        saved.message,
      relatedResourceIds: [
        saved.escalationId,
        saved.governanceRequestId,
        saved.decisionRecordId,
        saved.changeExecutionId,
      ].filter(
        (
          value,
        ): value is string =>
          Boolean(value),
      ),
      payload: {
        notificationId:
          saved.id,
        channel:
          saved.channel,
        recipients:
          saved.recipients.length,
        priority:
          saved.priority,
      },
      metadata: {},
      actor,
    });

    return saved;
  }

  markDelivered(
    id: string,
  ): GovernanceNotification {
    const notification =
      this.get(id);

    if (
      notification.status !==
      GovernanceNotificationStatus.SENT
    ) {
      throw new BadRequestException(
        "Only sent notifications can be marked delivered",
      );
    }

    notification.status =
      GovernanceNotificationStatus.DELIVERED;

    notification.deliveredAt =
      new Date().toISOString();

    return this.store
      .saveGovernanceNotification(
        notification,
      );
  }

  markFailed(
    id: string,
    error: string,
  ): GovernanceNotification {
    const notification =
      this.get(id);

    notification.status =
      GovernanceNotificationStatus.FAILED;

    notification.failedAt =
      new Date().toISOString();

    notification.error =
      error;

    return this.store
      .saveGovernanceNotification(
        notification,
      );
  }

  list():
    GovernanceNotification[] {
    return this.store
      .listGovernanceNotifications();
  }

  get(
    id: string,
  ): GovernanceNotification {
    const notification =
      this.store
        .getGovernanceNotification(id);

    if (!notification) {
      throw new NotFoundException(
        `Governance notification ${id} was not found`,
      );
    }

    return notification;
  }

  private nextNotificationNumber():
    string {
    const next =
      this.store
        .listGovernanceNotifications()
        .length + 1;

    return `AVOS-NOTIFY-${String(
      next,
    ).padStart(6, "0")}`;
  }
}
