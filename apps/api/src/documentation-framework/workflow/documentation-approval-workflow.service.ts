import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DecideDocumentationReviewDto } from "../dto/decide-documentation-review.dto";
import { RequestDocumentationReviewDto } from "../dto/request-documentation-review.dto";
import { DocumentationReviewRecord } from "../interfaces/documentation-workflow.types";
import { DocumentationAuditService } from "../audit/documentation-audit.service";

@Injectable()
export class DocumentationApprovalWorkflowService {
  private readonly reviews = new Map<string, DocumentationReviewRecord>();

  constructor(private readonly audit: DocumentationAuditService) {}

  request(
    documentId: string,
    dto: RequestDocumentationReviewDto,
  ): DocumentationReviewRecord {
    const pending = this.list(documentId).find(
      (item) => item.status === "pending",
    );

    if (pending) {
      throw new BadRequestException(
        `Document '${documentId}' already has a pending review.`,
      );
    }

    const record: DocumentationReviewRecord = {
      id: `adf-review:${documentId}:${Date.now()}`,
      documentId,
      version: dto.version.trim(),
      requestedBy: dto.requestedBy.trim(),
      requestedAt: new Date().toISOString(),
      status: "pending",
      humanFinalAuthorityRequired:
        dto.humanFinalAuthorityRequired !== false,
    };

    this.reviews.set(record.id, record);

    this.audit.record({
      documentId,
      action: "review-requested",
      actor: record.requestedBy,
      referenceId: record.id,
      details: {
        version: record.version,
        humanFinalAuthorityRequired: record.humanFinalAuthorityRequired,
      },
    });

    return record;
  }

  approve(
    reviewId: string,
    dto: DecideDocumentationReviewDto,
  ): DocumentationReviewRecord {
    const review = this.find(reviewId);

    if (review.status !== "pending") {
      throw new BadRequestException(
        `Review '${reviewId}' is already '${review.status}'.`,
      );
    }

    if (
      review.humanFinalAuthorityRequired &&
      !dto.reviewer.trim().startsWith("human:")
    ) {
      throw new BadRequestException(
        "Approval requires a Human Final Authority reviewer.",
      );
    }

    const reviewer = dto.reviewer.trim();

    const updated: DocumentationReviewRecord = {
      ...review,
      status: "approved",
      reviewer,
      decisionReason: dto.reason?.trim(),
      decidedAt: new Date().toISOString(),
    };

    this.reviews.set(reviewId, updated);

    this.audit.record({
      documentId: review.documentId,
      action: "review-approved",
      actor: reviewer,
      referenceId: reviewId,
      details: {
        version: review.version,
        reason: updated.decisionReason,
      },
    });

    return updated;
  }

  reject(
    reviewId: string,
    dto: DecideDocumentationReviewDto,
  ): DocumentationReviewRecord {
    const review = this.find(reviewId);

    if (review.status !== "pending") {
      throw new BadRequestException(
        `Review '${reviewId}' is already '${review.status}'.`,
      );
    }

    const reviewer = dto.reviewer.trim();

    const updated: DocumentationReviewRecord = {
      ...review,
      status: "rejected",
      reviewer,
      decisionReason: dto.reason?.trim() || "Rejected without reason.",
      decidedAt: new Date().toISOString(),
    };

    this.reviews.set(reviewId, updated);

    this.audit.record({
      documentId: review.documentId,
      action: "review-rejected",
      actor: reviewer,
      referenceId: reviewId,
      details: {
        version: review.version,
        reason: updated.decisionReason,
      },
    });

    return updated;
  }

  find(reviewId: string): DocumentationReviewRecord {
    const review = this.reviews.get(reviewId);

    if (!review) {
      throw new NotFoundException(`Review '${reviewId}' was not found.`);
    }

    return review;
  }

  list(documentId?: string): DocumentationReviewRecord[] {
    const records = Array.from(this.reviews.values());

    if (!documentId) {
      return records;
    }

    return records.filter((item) => item.documentId === documentId);
  }

  latestApproved(documentId: string): DocumentationReviewRecord | undefined {
    return this.list(documentId)
      .filter((item) => item.status === "approved")
      .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))[0];
  }

  count(): number {
    return this.reviews.size;
  }
}
