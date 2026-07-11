import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  APPROVAL_CODE_PREFIX,
  DEFAULT_APPROVAL_EXPIRY_HOURS,
  MEGA_PACK_6_COLLECTIONS,
} from "./constants/mega-pack-6.constants";
import { ApprovalVoteDto } from "./dto/approval-vote.dto";
import { CreateApprovalRequestDto } from "./dto/create-approval-request.dto";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import {
  ApprovalDecision,
  ApprovalRequest,
} from "./types/mega-pack-6.types";

@Injectable()
export class ApprovalWorkflowService {
  constructor(
    private readonly storage:
      MegaPack6StorageService,
    private readonly sequence:
      EnterpriseSequenceService,
    private readonly events:
      PlatformEventBusService,
  ) {}

  async create(
    dto: CreateApprovalRequestDto,
  ): Promise<ApprovalRequest> {
    const uniqueApprovers = [
      ...new Set(dto.requiredApprovers),
    ];

    if (
      dto.minimumApprovals >
      uniqueApprovers.length
    ) {
      throw new BadRequestException(
        "minimumApprovals cannot exceed the number of required approvers",
      );
    }

    const now = new Date();

    const expiresAt =
      dto.expiresAt ??
      new Date(
        now.getTime() +
          DEFAULT_APPROVAL_EXPIRY_HOURS *
            60 *
            60 *
            1000,
      ).toISOString();

    const request: ApprovalRequest = {
      id: randomUUID(),
      requestCode: this.sequence.next(
        APPROVAL_CODE_PREFIX,
      ),
      title: dto.title,
      description: dto.description,
      requestType: dto.requestType,
      requestedBy: dto.requestedBy,
      requiredApprovers: uniqueApprovers,
      minimumApprovals:
        dto.minimumApprovals,
      approvals: [],
      decision: "pending",
      expiresAt,
      entityReference: {
        entityType: dto.entityType,
        entityId: dto.entityId,
      },
      metadata: dto.metadata ?? {},
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    await this.storage.append(
      MEGA_PACK_6_COLLECTIONS.approvalRequests,
      request,
    );

    await this.events.publish({
      eventType:
        "approval.request.created",
      source:
        "ApprovalWorkflowService",
      severity: "medium",
      entityType: "approval_request",
      entityId: request.id,
      payload: {
        requestCode:
          request.requestCode,
        requestType:
          request.requestType,
        requiredApprovers:
          request.requiredApprovers,
        minimumApprovals:
          request.minimumApprovals,
      },
    });

    return request;
  }

  async list(
    decision?: ApprovalDecision,
  ): Promise<ApprovalRequest[]> {
    await this.expirePendingRequests();

    const requests =
      await this.storage.readCollection<ApprovalRequest>(
        MEGA_PACK_6_COLLECTIONS.approvalRequests,
      );

    return requests
      .filter(
        (request) =>
          !decision ||
          request.decision === decision,
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );
  }

  async get(
    id: string,
  ): Promise<ApprovalRequest> {
    const request =
      await this.storage.findById<ApprovalRequest>(
        MEGA_PACK_6_COLLECTIONS.approvalRequests,
        id,
      );

    if (!request) {
      throw new NotFoundException(
        `Approval request ${id} was not found`,
      );
    }

    return request;
  }

  async vote(
    id: string,
    dto: ApprovalVoteDto,
  ): Promise<ApprovalRequest> {
    const request = await this.get(id);

    if (request.decision !== "pending") {
      throw new BadRequestException(
        `Approval request is already ${request.decision}`,
      );
    }

    if (
      request.expiresAt &&
      new Date(request.expiresAt).getTime() <=
        Date.now()
    ) {
      return this.expireRequest(request);
    }

    if (
      !request.requiredApprovers.includes(
        dto.approver,
      )
    ) {
      throw new BadRequestException(
        `${dto.approver} is not an authorized approver`,
      );
    }

    if (
      request.approvals.some(
        (vote) =>
          vote.approver === dto.approver,
      )
    ) {
      throw new BadRequestException(
        `${dto.approver} has already voted`,
      );
    }

    const now = new Date().toISOString();

    const approvals = [
      ...request.approvals,
      {
        id: randomUUID(),
        approver: dto.approver,
        decision: dto.decision,
        comment: dto.comment,
        decidedAt: now,
      },
    ];

    const rejected =
      approvals.some(
        (vote) =>
          vote.decision === "rejected",
      );

    const approvalCount =
      approvals.filter(
        (vote) =>
          vote.decision === "approved",
      ).length;

    let decision:
      ApprovalRequest["decision"] =
      "pending";

    if (rejected) {
      decision = "rejected";
    } else if (
      approvalCount >=
      request.minimumApprovals
    ) {
      decision = "approved";
    }

    const updated: ApprovalRequest = {
      ...request,
      approvals,
      decision,
      decidedAt:
        decision !== "pending"
          ? now
          : undefined,
      updatedAt: now,
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.approvalRequests,
      id,
      updated,
    );

    await this.events.publish({
      eventType:
        decision === "pending"
          ? "approval.vote.recorded"
          : `approval.request.${decision}`,
      source:
        "ApprovalWorkflowService",
      severity:
        decision === "rejected"
          ? "high"
          : "medium",
      entityType: "approval_request",
      entityId: id,
      payload: {
        approver: dto.approver,
        vote: dto.decision,
        finalDecision: decision,
        approvalCount,
      },
    });

    return updated;
  }

  async cancel(
    id: string,
    actor: string,
  ): Promise<ApprovalRequest> {
    const request = await this.get(id);

    if (request.decision !== "pending") {
      throw new BadRequestException(
        "Only pending approval requests can be cancelled",
      );
    }

    const now = new Date().toISOString();

    const updated: ApprovalRequest = {
      ...request,
      decision: "cancelled",
      decidedAt: now,
      updatedAt: now,
      metadata: {
        ...request.metadata,
        cancelledBy: actor,
      },
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.approvalRequests,
      id,
      updated,
    );

    return updated;
  }

  async expirePendingRequests(): Promise<{
    evaluated: number;
    expired: number;
  }> {
    const requests =
      await this.storage.readCollection<ApprovalRequest>(
        MEGA_PACK_6_COLLECTIONS.approvalRequests,
      );

    let expired = 0;
    const now = new Date().toISOString();

    const updated =
      requests.map((request) => {
        if (
          request.decision === "pending" &&
          request.expiresAt &&
          new Date(
            request.expiresAt,
          ).getTime() <= Date.now()
        ) {
          expired += 1;

          return {
            ...request,
            decision: "expired" as const,
            decidedAt: now,
            updatedAt: now,
          };
        }

        return request;
      });

    if (expired > 0) {
      await this.storage.writeCollection(
        MEGA_PACK_6_COLLECTIONS.approvalRequests,
        updated,
      );
    }

    return {
      evaluated: requests.length,
      expired,
    };
  }

  private async expireRequest(
    request: ApprovalRequest,
  ): Promise<ApprovalRequest> {
    const now = new Date().toISOString();

    const updated: ApprovalRequest = {
      ...request,
      decision: "expired",
      decidedAt: now,
      updatedAt: now,
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.approvalRequests,
      request.id,
      updated,
    );

    return updated;
  }
}
