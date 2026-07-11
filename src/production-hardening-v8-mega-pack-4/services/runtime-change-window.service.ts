import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  ChangeWindowStatus,
  GovernanceAuditEventType,
  GovernanceChangeWindow,
  GovernanceJsonValue,
} from "../contracts";
import {
  CreateChangeWindowDto,
  UpdateChangeWindowStatusDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeGovernanceAuditService,
} from "./runtime-governance-audit.service";

@Injectable()
export class RuntimeChangeWindowService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly audit:
      RuntimeGovernanceAuditService,
  ) {}

  create(
    dto: CreateChangeWindowDto,
  ): GovernanceChangeWindow {
    const startsAt =
      new Date(dto.startsAt);

    const endsAt =
      new Date(dto.endsAt);

    if (
      Number.isNaN(startsAt.getTime()) ||
      Number.isNaN(endsAt.getTime())
    ) {
      throw new BadRequestException(
        "Invalid change window dates",
      );
    }

    if (
      endsAt.getTime() <=
      startsAt.getTime()
    ) {
      throw new BadRequestException(
        "Change window end must be after start",
      );
    }

    const duplicate =
      this.store
        .listChangeWindows()
        .find(
          (window) =>
            window.key === dto.key &&
            ![
              ChangeWindowStatus.CANCELLED,
              ChangeWindowStatus.EXPIRED,
            ].includes(window.status),
        );

    if (duplicate) {
      throw new BadRequestException(
        `Active change window already exists for key ${dto.key}`,
      );
    }

    const now =
      new Date().toISOString();

    const item:
      GovernanceChangeWindow = {
      id: randomUUID(),
      key: dto.key,
      name: dto.name,
      description: dto.description,
      environment:
        dto.environment,
      namespace:
        dto.namespace,
      type: dto.type,
      status:
        ChangeWindowStatus.DRAFT,
      startsAt:
        startsAt.toISOString(),
      endsAt:
        endsAt.toISOString(),
      timezone:
        dto.timezone,
      allowedRequestTypes:
        dto.allowedRequestTypes ?? [],
      blockedRequestTypes:
        dto.blockedRequestTypes ?? [],
      maximumRiskLevel:
        dto.maximumRiskLevel,
      requiresApproval:
        dto.requiresApproval ?? true,
      requiredApprovalCount:
        dto.requiredApprovalCount ?? 1,
      tags:
        dto.tags ?? [],
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
    };

    const saved =
      this.store.saveChangeWindow(item);

    this.audit.append({
      type:
        GovernanceAuditEventType
          .CHANGE_WINDOW_CREATED,
      aggregateType:
        "governance_change_window",
      aggregateId:
        saved.id,
      actor:
        dto.actor,
      payload: {
        changeWindowId:
          saved.id,
        key:
          saved.key,
        environment:
          saved.environment,
        namespace:
          saved.namespace,
        type:
          saved.type,
        status:
          saved.status,
        startsAt:
          saved.startsAt,
        endsAt:
          saved.endsAt,
        maximumRiskLevel:
          saved.maximumRiskLevel,
      },
    });

    return saved;
  }

  list():
    GovernanceChangeWindow[] {
    return this.store
      .listChangeWindows()
      .map((window) =>
        this.normalizeStatus(window),
      );
  }

  get(
    id: string,
  ): GovernanceChangeWindow {
    const item =
      this.store.getChangeWindow(id);

    if (!item) {
      throw new NotFoundException(
        `Change window ${id} was not found`,
      );
    }

    return this.normalizeStatus(item);
  }

  updateStatus(
    id: string,
    dto:
      UpdateChangeWindowStatusDto,
  ): GovernanceChangeWindow {
    const item =
      this.get(id);

    this.validateTransition(
      item.status,
      dto.status,
    );

    const now =
      new Date().toISOString();

    item.status =
      dto.status;

    item.updatedAt =
      now;

    if (
      dto.status ===
      ChangeWindowStatus.OPEN
    ) {
      item.openedAt =
        now;
    }

    if (
      dto.status ===
      ChangeWindowStatus.CLOSED
    ) {
      item.closedAt =
        now;
    }

    if (
      dto.status ===
      ChangeWindowStatus.CANCELLED
    ) {
      item.cancelledAt =
        now;
    }

    const saved =
      this.store.saveChangeWindow(item);

    this.audit.append({
      type:
        GovernanceAuditEventType
          .CHANGE_WINDOW_UPDATED,
      aggregateType:
        "governance_change_window",
      aggregateId:
        saved.id,
      actor:
        dto.actor,
      payload: {
        changeWindowId:
          saved.id,
        status:
          saved.status,
        reason:
          dto.reason,
        updatedAt:
          saved.updatedAt,
      },
    });

    return saved;
  }

  isRequestAllowed(
    windowId: string,
    requestType: string,
    riskLevel: string,
  ): {
    allowed: boolean;
    reason: string;
  } {
    const window =
      this.get(windowId);

    if (
      window.status !==
      ChangeWindowStatus.OPEN
    ) {
      return {
        allowed: false,
        reason:
          `Change window is not open: ${window.status}`,
      };
    }

    if (
      window.blockedRequestTypes.includes(
        requestType as never,
      )
    ) {
      return {
        allowed: false,
        reason:
          "Request type is explicitly blocked",
      };
    }

    if (
      window.allowedRequestTypes.length > 0 &&
      !window.allowedRequestTypes.includes(
        requestType as never,
      )
    ) {
      return {
        allowed: false,
        reason:
          "Request type is not allowed in this window",
      };
    }

    const rank:
      Record<string, number> = {
      informational: 0,
      low: 1,
      medium: 2,
      high: 3,
      critical: 4,
    };

    const requestRank =
      rank[riskLevel] ?? 99;

    const maximumRank =
      rank[
        window.maximumRiskLevel
      ] ?? -1;

    if (
      requestRank >
      maximumRank
    ) {
      return {
        allowed: false,
        reason:
          "Request risk exceeds the window maximum risk",
      };
    }

    return {
      allowed: true,
      reason:
        "Request is allowed in the current change window",
    };
  }

  private normalizeStatus(
    item: GovernanceChangeWindow,
  ): GovernanceChangeWindow {
    const now =
      Date.now();

    const startsAt =
      new Date(
        item.startsAt,
      ).getTime();

    const endsAt =
      new Date(
        item.endsAt,
      ).getTime();

    if (
      item.status ===
        ChangeWindowStatus.SCHEDULED &&
      now >= startsAt &&
      now < endsAt
    ) {
      item.status =
        ChangeWindowStatus.OPEN;

      item.openedAt =
        new Date().toISOString();

      item.updatedAt =
        item.openedAt;

      return this.store
        .saveChangeWindow(item);
    }

    if (
      [
        ChangeWindowStatus.SCHEDULED,
        ChangeWindowStatus.OPEN,
      ].includes(item.status) &&
      now >= endsAt
    ) {
      item.status =
        ChangeWindowStatus.EXPIRED;

      item.updatedAt =
        new Date().toISOString();

      return this.store
        .saveChangeWindow(item);
    }

    return item;
  }

  private validateTransition(
    current: ChangeWindowStatus,
    next: ChangeWindowStatus,
  ): void {
    if (current === next) {
      return;
    }

    const transitions:
      Record<
        ChangeWindowStatus,
        ChangeWindowStatus[]
      > = {
      [ChangeWindowStatus.DRAFT]: [
        ChangeWindowStatus.SCHEDULED,
        ChangeWindowStatus.CANCELLED,
      ],
      [ChangeWindowStatus.SCHEDULED]: [
        ChangeWindowStatus.OPEN,
        ChangeWindowStatus.CANCELLED,
        ChangeWindowStatus.EXPIRED,
      ],
      [ChangeWindowStatus.OPEN]: [
        ChangeWindowStatus.CLOSED,
        ChangeWindowStatus.CANCELLED,
        ChangeWindowStatus.EXPIRED,
      ],
      [ChangeWindowStatus.CLOSED]: [],
      [ChangeWindowStatus.CANCELLED]: [],
      [ChangeWindowStatus.EXPIRED]: [],
    };

    if (
      !transitions[current].includes(next)
    ) {
      throw new BadRequestException(
        `Invalid change window transition from ${current} to ${next}`,
      );
    }
  }
}
