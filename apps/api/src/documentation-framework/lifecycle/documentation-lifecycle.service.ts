import { BadRequestException, Injectable } from "@nestjs/common";
import { TransitionDocumentationStatusDto } from "../dto/transition-documentation-status.dto";
import { AvosDocumentStatus } from "../interfaces/documentation.types";
import { DocumentationRegistryService } from "../registry/documentation-registry.service";
import { DocumentationAuditService } from "../audit/documentation-audit.service";
import { DocumentationApprovalWorkflowService } from "../workflow/documentation-approval-workflow.service";

@Injectable()
export class DocumentationLifecycleService {
  private readonly transitions: Record<
    AvosDocumentStatus,
    AvosDocumentStatus[]
  > = {
    draft: ["under-review", "deprecated"],
    "under-review": ["approved", "draft", "deprecated"],
    approved: ["active", "draft", "deprecated"],
    active: ["superseded", "deprecated"],
    deprecated: ["draft"],
    superseded: [],
  };

  constructor(
    private readonly registry: DocumentationRegistryService,
    private readonly workflow: DocumentationApprovalWorkflowService,
    private readonly audit: DocumentationAuditService,
  ) {}

  transition(documentId: string, dto: TransitionDocumentationStatusDto) {
    const current = this.registry.findById(documentId);
    const allowed = this.transitions[current.status];

    if (!allowed.includes(dto.nextStatus)) {
      throw new BadRequestException(
        `Transition '${current.status}' -> '${dto.nextStatus}' is not allowed.`,
      );
    }

    if (
      dto.nextStatus === "approved" ||
      dto.nextStatus === "active"
    ) {
      const approvedReview = this.workflow.latestApproved(documentId);

      if (!approvedReview) {
        throw new BadRequestException(
          `An approved human review is required before '${dto.nextStatus}'.`,
        );
      }

      if (!approvedReview.reviewer?.startsWith("human:")) {
        throw new BadRequestException(
          "Human Final Authority approval is required.",
        );
      }
    }

    if (
      current.category === "constitution" &&
      dto.nextStatus === "deprecated" &&
      !dto.actor.trim().startsWith("human:")
    ) {
      throw new BadRequestException(
        "Constitutional documents may only be deprecated by Human Final Authority.",
      );
    }

    const updated = this.registry.update(documentId, {
      status: dto.nextStatus,
      approver:
        dto.nextStatus === "approved" || dto.nextStatus === "active"
          ? dto.actor.trim()
          : current.approver,
      metadata: {
        lastTransitionReason: dto.reason?.trim(),
      },
    });

    this.audit.record({
      documentId,
      action: "status-transitioned",
      actor: dto.actor,
      previousStatus: current.status,
      nextStatus: dto.nextStatus,
      details: {
        reason: dto.reason,
      },
    });

    return updated;
  }

  allowedTransitions(status: AvosDocumentStatus): AvosDocumentStatus[] {
    return [...this.transitions[status]];
  }
}
