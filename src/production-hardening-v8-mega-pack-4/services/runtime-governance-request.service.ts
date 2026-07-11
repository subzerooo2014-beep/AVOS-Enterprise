import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceApprovalStatus,
  GovernanceAuditEventType,
  GovernanceControlMode,
  GovernanceDecision,
  GovernanceJsonValue,
  GovernanceRequest,
  GovernanceRequestStatus,
  GovernanceRiskLevel,
} from "../contracts";
import {
  CreateGovernanceRequestDto,
  RecordGovernanceApprovalDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  approvalsFromGovernanceRisk,
} from "../utils";
import {
  RuntimeChangeWindowService,
} from "./runtime-change-window.service";
import {
  RuntimeGovernanceAuditService,
} from "./runtime-governance-audit.service";
import {
  RuntimeMaintenanceModeService,
} from "./runtime-maintenance-mode.service";

@Injectable()
export class RuntimeGovernanceRequestService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly audit:
      RuntimeGovernanceAuditService,
    private readonly changeWindows:
      RuntimeChangeWindowService,
    private readonly maintenance:
      RuntimeMaintenanceModeService,
  ) {}

  create(
    dto:
      CreateGovernanceRequestDto,
  ): GovernanceRequest {
    if (
      dto.changeWindowId
    ) {
      this.changeWindows.get(
        dto.changeWindowId,
      );
    }

    if (
      dto.maintenanceModeId
    ) {
      this.maintenance.get(
        dto.maintenanceModeId,
      );
    }

    const now =
      new Date().toISOString();

    const item:
      GovernanceRequest = {
      id:
        randomUUID(),
      requestNumber:
        this.nextRequestNumber(),
      type:
        dto.type,
      status:
        GovernanceRequestStatus.PENDING,
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
      requestedRiskLevel:
        dto.requestedRiskLevel,
      changeWindowId:
        dto.changeWindowId,
      maintenanceModeId:
        dto.maintenanceModeId,
      rollbackPlanAvailable:
        dto.rollbackPlanAvailable,
      testCoverage:
        dto.testCoverage,
      blastRadius:
        dto.blastRadius,
      businessCriticality:
        dto.businessCriticality,
      approvalsRequired:
        dto.approvalsRequired ??
        approvalsFromGovernanceRisk(
          dto.requestedRiskLevel,
        ),
      approvals:
        [],
      evaluationFactors:
        [],
      recommendations:
        [],
      payload:
        dto.payload as Record<
          string,
          GovernanceJsonValue
        >,
      metadata:
        (dto.metadata ?? {}) as Record<
          string,
          GovernanceJsonValue
        >,
      requestedBy:
        dto.actor,
      createdAt:
        now,
      updatedAt:
        now,
    };

    const saved =
      this.store
        .saveGovernanceRequest(item);

    this.audit.append({
      type:
        GovernanceAuditEventType
          .GOVERNANCE_REQUEST_CREATED,
      aggregateType:
        "governance_request",
      aggregateId:
        saved.id,
      actor:
        dto.actor,
      payload: {
        requestId:
          saved.id,
        requestNumber:
          saved.requestNumber,
        type:
          saved.type,
        environment:
          saved.environment,
        namespace:
          saved.namespace,
        requestedRiskLevel:
          saved.requestedRiskLevel,
        approvalsRequired:
          saved.approvalsRequired,
      },
    });

    return saved;
  }

  list():
    GovernanceRequest[] {
    return this.store
      .listGovernanceRequests();
  }

  get(
    id: string,
  ): GovernanceRequest {
    const item =
      this.store
        .getGovernanceRequest(id);

    if (!item) {
      throw new NotFoundException(
        `Governance request ${id} was not found`,
      );
    }

    return item;
  }

  recordApproval(
    id: string,
    dto:
      RecordGovernanceApprovalDto,
  ): GovernanceRequest {
    const item =
      this.get(id);

    if (
      ![
        GovernanceRequestStatus.PENDING,
        GovernanceRequestStatus.EVALUATING,
        GovernanceRequestStatus.DEFERRED,
      ].includes(item.status)
    ) {
      throw new BadRequestException(
        `Request cannot receive approvals in status ${item.status}`,
      );
    }

    const existing =
      item.approvals.find(
        (approval) =>
          approval.actor.id ===
          dto.actor.id,
      );

    if (existing) {
      throw new BadRequestException(
        `Actor ${dto.actor.id} already recorded an approval decision`,
      );
    }

    const now =
      new Date().toISOString();

    item.approvals.push({
      id:
        randomUUID(),
      requestId:
        item.id,
      status:
        dto.status,
      actor:
        dto.actor,
      reason:
        dto.reason,
      createdAt:
        now,
      expiresAt:
        dto.expiresAt,
    });

    if (
      dto.status ===
      GovernanceApprovalStatus.REJECTED
    ) {
      item.status =
        GovernanceRequestStatus.REJECTED;

      item.decision =
        GovernanceDecision.BLOCK;

      item.rejectedAt =
        now;
    } else {
      const approvedCount =
        item.approvals.filter(
          (approval) =>
            approval.status ===
            GovernanceApprovalStatus.APPROVED &&
            (
              !approval.expiresAt ||
              new Date(
                approval.expiresAt,
              ).getTime() > Date.now()
            ),
        ).length;

      if (
        approvedCount >=
        item.approvalsRequired
      ) {
        item.status =
          GovernanceRequestStatus.APPROVED;

        item.decision =
          GovernanceDecision.ALLOW;

        item.approvedAt =
          now;
      }
    }

    item.updatedAt =
      now;

    const saved =
      this.store
        .saveGovernanceRequest(item);

    this.audit.append({
      type:
        GovernanceAuditEventType
          .APPROVAL_RECORDED,
      aggregateType:
        "governance_request",
      aggregateId:
        saved.id,
      actor:
        dto.actor,
      payload: {
        requestId:
          saved.id,
        approvalStatus:
          dto.status,
        requestStatus:
          saved.status,
        approvalsRequired:
          saved.approvalsRequired,
        approvedCount:
          saved.approvals.filter(
            (approval) =>
              approval.status ===
              GovernanceApprovalStatus.APPROVED,
          ).length,
        reason:
          dto.reason,
      },
    });

    return saved;
  }

  markExecuted(
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
  ): GovernanceRequest {
    const item =
      this.get(id);

    if (
      item.status !==
      GovernanceRequestStatus.APPROVED
    ) {
      throw new BadRequestException(
        `Only approved requests can be executed. Current status: ${item.status}`,
      );
    }

    if (
      this.store.getControlMode() ===
      GovernanceControlMode.LOCKDOWN
    ) {
      throw new BadRequestException(
        "Governance control plane is in lockdown mode",
      );
    }

    const maintenancePolicy =
      this.maintenance.getAccessPolicy(
        item.environment,
        item.namespace,
        item.service,
      );

    if (
      item.type === "deployment" &&
      !maintenancePolicy.allowDeployments
    ) {
      throw new BadRequestException(
        "Deployments are blocked by active maintenance mode",
      );
    }

    item.status =
      GovernanceRequestStatus.EXECUTED;

    item.executedAt =
      new Date().toISOString();

    item.updatedAt =
      item.executedAt;

    const saved =
      this.store
        .saveGovernanceRequest(item);

    this.audit.append({
      type:
        GovernanceAuditEventType
          .GOVERNANCE_REQUEST_EVALUATED,
      aggregateType:
        "governance_request",
      aggregateId:
        saved.id,
      actor,
      payload: {
        requestId:
          saved.id,
        status:
          saved.status,
        executedAt:
          saved.executedAt ?? null,
      },
    });

    return saved;
  }

  private nextRequestNumber():
    string {
    const next =
      this.store
        .listGovernanceRequests()
        .length + 1;

    return `AVOS-GOV-${String(
      next,
    ).padStart(6, "0")}`;
  }
}
