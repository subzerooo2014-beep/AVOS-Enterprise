import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceEscalation,
  GovernanceEscalationStatus,
  GovernanceJsonValue,
  GovernanceNotificationChannel,
  GovernanceTimelineEventType,
} from "../contracts";
import {
  CreateGovernanceEscalationDto,
  UpdateGovernanceEscalationDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeGovernanceNotificationService,
} from "./runtime-governance-notification.service";
import {
  RuntimeGovernanceTimelineService,
} from "./runtime-governance-timeline.service";

@Injectable()
export class RuntimeGovernanceEscalationService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly notifications:
      RuntimeGovernanceNotificationService,
    private readonly timeline:
      RuntimeGovernanceTimelineService,
  ) {}

  create(
    dto:
      CreateGovernanceEscalationDto,
  ): GovernanceEscalation {
    const now =
      new Date().toISOString();

    const escalation:
      GovernanceEscalation = {
      id:
        randomUUID(),
      escalationNumber:
        this.nextEscalationNumber(),
      status:
        GovernanceEscalationStatus.OPEN,
      severity:
        dto.severity,
      reason:
        dto.reason,
      title:
        dto.title,
      description:
        dto.description,
      environment:
        dto.environment,
      namespace:
        dto.namespace,
      service:
        dto.service,
      governanceRequestId:
        dto.governanceRequestId,
      decisionRecordId:
        dto.decisionRecordId,
      changeExecutionId:
        dto.changeExecutionId,
      runbookExecutionId:
        dto.runbookExecutionId,
      recoveryPlanId:
        dto.recoveryPlanId,
      isolationPlanId:
        dto.isolationPlanId,
      dependencyNodeId:
        dto.dependencyNodeId,
      sloEvaluationId:
        dto.sloEvaluationId,
      capacityEvaluationId:
        dto.capacityEvaluationId,
      assignedRoles:
        dto.assignedRoles,
      assignedActors:
        dto.assignedActors ?? [],
      acknowledgementRequired:
        dto.acknowledgementRequired,
      metadata:
        (dto.metadata ?? {}) as Record<
          string,
          GovernanceJsonValue
        >,
      createdBy:
        dto.actor,
      createdAt:
        now,
      updatedAt:
        now,
      expiresAt:
        dto.expiresAt,
    };

    const saved =
      this.store
        .saveGovernanceEscalation(
          escalation,
        );

    this.timeline.append({
      aggregateType:
        "governance_escalation",
      aggregateId:
        saved.id,
      type:
        GovernanceTimelineEventType.ESCALATION_CREATED,
      title:
        saved.title,
      description:
        saved.description,
      relatedResourceIds: [
        saved.governanceRequestId,
        saved.decisionRecordId,
        saved.changeExecutionId,
        saved.runbookExecutionId,
        saved.recoveryPlanId,
      ].filter(
        (
          value,
        ): value is string =>
          Boolean(value),
      ),
      payload: {
        escalationId:
          saved.id,
        severity:
          saved.severity,
        reason:
          saved.reason,
        status:
          saved.status,
      },
      metadata: {},
      actor:
        dto.actor,
    });

    return saved;
  }

  createNotification(
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
  ) {
    const escalation =
      this.get(id);

    const recipients =
      escalation.assignedActors
        .map((assignedActor) => ({
          id:
            assignedActor.id,
          name:
            assignedActor.name,
          address:
            assignedActor.id,
          channel:
            GovernanceNotificationChannel.INTERNAL,
          roles:
            assignedActor.roles,
        }));

    if (
      recipients.length === 0
    ) {
      recipients.push({
        id:
          "avos-governance-operations",
        name:
          "AVOS Governance Operations",
        address:
          "governance-operations",
        channel:
          GovernanceNotificationChannel.INTERNAL,
        roles:
          escalation.assignedRoles,
      });
    }

    return this.notifications.create({
      channel:
        GovernanceNotificationChannel.INTERNAL,
      subject:
        `[${escalation.severity}] ${escalation.title}`,
      message:
        escalation.description,
      recipients,
      escalationId:
        escalation.id,
      governanceRequestId:
        escalation.governanceRequestId,
      decisionRecordId:
        escalation.decisionRecordId,
      changeExecutionId:
        escalation.changeExecutionId,
      priority:
        this.priorityFromSeverity(
          escalation.severity,
        ),
      deduplicationKey:
        `escalation:${escalation.id}`,
      payload: {
        escalationNumber:
          escalation.escalationNumber,
        severity:
          escalation.severity,
        reason:
          escalation.reason,
      },
      metadata: {},
      actor,
    });
  }

  update(
    id: string,
    dto:
      UpdateGovernanceEscalationDto,
  ): GovernanceEscalation {
    const escalation =
      this.get(id);

    this.validateTransition(
      escalation.status,
      dto.status,
    );

    const now =
      new Date().toISOString();

    escalation.status =
      dto.status;

    escalation.updatedAt =
      now;

    if (
      dto.status ===
      GovernanceEscalationStatus.ACKNOWLEDGED
    ) {
      escalation.acknowledgedBy =
        dto.actor;

      escalation.acknowledgedAt =
        now;
    }

    if (
      dto.status ===
      GovernanceEscalationStatus.RESOLVED
    ) {
      escalation.resolvedAt =
        now;

      escalation.resolution =
        dto.resolution ??
        dto.reason;
    }

    if (
      dto.status ===
      GovernanceEscalationStatus.CANCELLED
    ) {
      escalation.cancelledAt =
        now;
    }

    const saved =
      this.store
        .saveGovernanceEscalation(
          escalation,
        );

    this.timeline.append({
      aggregateType:
        "governance_escalation",
      aggregateId:
        saved.id,
      type:
        GovernanceTimelineEventType.ESCALATION_UPDATED,
      title:
        `Escalation updated: ${saved.title}`,
      description:
        dto.reason,
      relatedResourceIds: [
        saved.governanceRequestId,
        saved.changeExecutionId,
      ].filter(
        (
          value,
        ): value is string =>
          Boolean(value),
      ),
      payload: {
        escalationId:
          saved.id,
        status:
          saved.status,
        resolution:
          saved.resolution ?? null,
      },
      metadata: {},
      actor:
        dto.actor,
    });

    return saved;
  }

  list():
    GovernanceEscalation[] {
    this.expireEscalations();

    return this.store
      .listGovernanceEscalations();
  }

  get(
    id: string,
  ): GovernanceEscalation {
    const escalation =
      this.store
        .getGovernanceEscalation(id);

    if (!escalation) {
      throw new NotFoundException(
        `Governance escalation ${id} was not found`,
      );
    }

    return escalation;
  }

  private expireEscalations():
    void {
    const now =
      Date.now();

    for (
      const escalation of
      this.store
        .listGovernanceEscalations()
    ) {
      if (
        escalation.expiresAt &&
        ![
          GovernanceEscalationStatus.RESOLVED,
          GovernanceEscalationStatus.CANCELLED,
          GovernanceEscalationStatus.EXPIRED,
        ].includes(escalation.status) &&
        new Date(
          escalation.expiresAt,
        ).getTime() <= now
      ) {
        escalation.status =
          GovernanceEscalationStatus.EXPIRED;

        escalation.updatedAt =
          new Date().toISOString();

        this.store
          .saveGovernanceEscalation(
            escalation,
          );
      }
    }
  }

  private validateTransition(
    current:
      GovernanceEscalationStatus,
    next:
      GovernanceEscalationStatus,
  ): void {
    if (current === next) {
      return;
    }

    const transitions:
      Record<
        GovernanceEscalationStatus,
        GovernanceEscalationStatus[]
      > = {
      [GovernanceEscalationStatus.OPEN]: [
        GovernanceEscalationStatus.ACKNOWLEDGED,
        GovernanceEscalationStatus.IN_PROGRESS,
        GovernanceEscalationStatus.RESOLVED,
        GovernanceEscalationStatus.CANCELLED,
        GovernanceEscalationStatus.EXPIRED,
      ],
      [GovernanceEscalationStatus.ACKNOWLEDGED]: [
        GovernanceEscalationStatus.IN_PROGRESS,
        GovernanceEscalationStatus.RESOLVED,
        GovernanceEscalationStatus.CANCELLED,
        GovernanceEscalationStatus.EXPIRED,
      ],
      [GovernanceEscalationStatus.IN_PROGRESS]: [
        GovernanceEscalationStatus.RESOLVED,
        GovernanceEscalationStatus.CANCELLED,
        GovernanceEscalationStatus.EXPIRED,
      ],
      [GovernanceEscalationStatus.RESOLVED]: [],
      [GovernanceEscalationStatus.CANCELLED]: [],
      [GovernanceEscalationStatus.EXPIRED]: [],
    };

    if (
      !transitions[current].includes(next)
    ) {
      throw new BadRequestException(
        `Invalid escalation transition from ${current} to ${next}`,
      );
    }
  }

  private nextEscalationNumber():
    string {
    const next =
      this.store
        .listGovernanceEscalations()
        .length + 1;

    return `AVOS-ESC-${String(
      next,
    ).padStart(6, "0")}`;
  }

  private priorityFromSeverity(
    severity: string,
  ): number {
    switch (severity) {
      case "emergency":
        return 100;

      case "critical":
        return 90;

      case "high":
        return 75;

      case "warning":
        return 50;

      default:
        return 25;
    }
  }
}
