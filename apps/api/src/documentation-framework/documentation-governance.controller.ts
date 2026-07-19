import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { DocumentationGovernanceService } from "./documentation-governance.service";
import { CreateDocumentationVersionDto } from "./dto/create-documentation-version.dto";
import { RequestDocumentationReviewDto } from "./dto/request-documentation-review.dto";
import { DecideDocumentationReviewDto } from "./dto/decide-documentation-review.dto";
import { TransitionDocumentationStatusDto } from "./dto/transition-documentation-status.dto";
import { CertifyDocumentationDto } from "./dto/certify-documentation.dto";

@Controller("avos/documentation/governance")
export class DocumentationGovernanceController {
  constructor(
    private readonly governance: DocumentationGovernanceService,
  ) {}

  @Get("status")
  status() {
    return this.governance.status();
  }

  @Post("documents/:documentId/versions")
  createVersion(
    @Param("documentId") documentId: string,
    @Body() dto: CreateDocumentationVersionDto,
  ) {
    return this.governance.createVersion(documentId, dto);
  }

  @Get("documents/:documentId/versions")
  listVersions(@Param("documentId") documentId: string) {
    return this.governance.listVersions(documentId);
  }

  @Post("documents/:documentId/reviews")
  requestReview(
    @Param("documentId") documentId: string,
    @Body() dto: RequestDocumentationReviewDto,
  ) {
    return this.governance.requestReview(documentId, dto);
  }

  @Post("reviews/:reviewId/approve")
  approveReview(
    @Param("reviewId") reviewId: string,
    @Body() dto: DecideDocumentationReviewDto,
  ) {
    return this.governance.approveReview(reviewId, dto);
  }

  @Post("reviews/:reviewId/reject")
  rejectReview(
    @Param("reviewId") reviewId: string,
    @Body() dto: DecideDocumentationReviewDto,
  ) {
    return this.governance.rejectReview(reviewId, dto);
  }

  @Get("reviews")
  listReviews(@Query("documentId") documentId?: string) {
    return this.governance.listReviews(documentId);
  }

  @Post("documents/:documentId/transition")
  transition(
    @Param("documentId") documentId: string,
    @Body() dto: TransitionDocumentationStatusDto,
  ) {
    return this.governance.transition(documentId, dto);
  }

  @Get("documents/:documentId/transitions")
  allowedTransitions(@Param("documentId") documentId: string) {
    return this.governance.allowedTransitions(documentId);
  }

  @Post("documents/:documentId/certify")
  certify(
    @Param("documentId") documentId: string,
    @Body() dto: CertifyDocumentationDto,
  ) {
    return this.governance.certify(documentId, dto);
  }

  @Get("documents/:documentId/certification")
  certificationStatus(@Param("documentId") documentId: string) {
    return this.governance.certificationStatus(documentId);
  }

  @Get("audit")
  auditTrail(@Query("documentId") documentId?: string) {
    return this.governance.auditTrail(documentId);
  }

  @Post("verification/run")
  verify() {
    return this.governance.verify();
  }
}
