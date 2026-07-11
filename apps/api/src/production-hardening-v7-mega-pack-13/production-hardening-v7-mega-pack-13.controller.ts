import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { CreateAccessReviewDto } from "./dto/create-access-review.dto";
import { CreateDataAssetDto } from "./dto/create-data-asset.dto";
import { CreateDataQualityRuleDto } from "./dto/create-data-quality-rule.dto";
import { CreateLineageEdgeDto } from "./dto/create-lineage-edge.dto";
import { CreateLineageNodeDto } from "./dto/create-lineage-node.dto";
import { CreatePrivacyRequestDto } from "./dto/create-privacy-request.dto";
import { CreateRetentionPolicyDto } from "./dto/create-retention-policy.dto";
import { EvaluateDataQualityDto } from "./dto/evaluate-data-quality.dto";
import { ProductionHardeningV7MegaPack13Service } from "./production-hardening-v7-mega-pack-13.service";

@Controller("production-hardening-v7-mega-pack-13")
export class ProductionHardeningV7MegaPack13Controller {
  constructor(
    private readonly service: ProductionHardeningV7MegaPack13Service,
  ) {}

  @Get("status")
  status() {
    return this.service.getStatus();
  }

  @Get("snapshot")
  snapshot() {
    return {
      success: true,
      snapshot: this.service.getSnapshot(),
    };
  }

  @Get("verify")
  verify() {
    return this.service.runVerification();
  }

  @Get("evidence/verify")
  verifyEvidence() {
    return {
      success: true,
      ...this.service.verifyEvidenceChain(),
    };
  }

  @Get("evidence")
  evidence() {
    return {
      success: true,
      entries: this.service.listEvidenceEntries(),
    };
  }

  @Get("events")
  events() {
    return {
      success: true,
      events: this.service.listPlatformEvents(),
    };
  }

  @Post("data-assets")
  createDataAsset(@Body() dto: CreateDataAssetDto) {
    return {
      success: true,
      asset: this.service.createDataAsset(dto, "api"),
    };
  }

  @Get("data-assets")
  listDataAssets() {
    return {
      success: true,
      assets: this.service.listDataAssets(),
    };
  }

  @Get("data-assets/:assetId")
  getDataAsset(@Param("assetId") assetId: string) {
    return {
      success: true,
      asset: this.service.getDataAsset(assetId),
    };
  }

  @Post("data-assets/:assetId/activate")
  activateDataAsset(
    @Param("assetId") assetId: string,
  ) {
    return {
      success: true,
      asset: this.service.activateDataAsset(
        assetId,
        "api",
      ),
    };
  }

  @Post("retention-policies")
  createRetentionPolicy(
    @Body() dto: CreateRetentionPolicyDto,
  ) {
    return {
      success: true,
      policy: this.service.createRetentionPolicy(
        dto,
        "api",
      ),
    };
  }

  @Get("retention-policies")
  listRetentionPolicies() {
    return {
      success: true,
      policies:
        this.service.listRetentionPolicies(),
    };
  }

  @Post("retention-policies/:policyId/activate")
  activateRetentionPolicy(
    @Param("policyId") policyId: string,
  ) {
    return {
      success: true,
      policy:
        this.service.activateRetentionPolicy(
          policyId,
          "api",
        ),
    };
  }

  @Post("lineage/nodes")
  createLineageNode(
    @Body() dto: CreateLineageNodeDto,
  ) {
    return {
      success: true,
      node: this.service.createLineageNode(
        dto,
        "api",
      ),
    };
  }

  @Get("lineage/nodes")
  listLineageNodes(
    @Query("assetId") assetId?: string,
  ) {
    return {
      success: true,
      nodes: this.service.listLineageNodes(assetId),
    };
  }

  @Post("lineage/edges")
  createLineageEdge(
    @Body() dto: CreateLineageEdgeDto,
  ) {
    return {
      success: true,
      edge: this.service.createLineageEdge(
        dto,
        "api",
      ),
    };
  }

  @Get("lineage/edges")
  listLineageEdges(
    @Query("assetId") assetId?: string,
  ) {
    return {
      success: true,
      edges: this.service.listLineageEdges(assetId),
    };
  }

  @Post("access-reviews")
  createAccessReview(
    @Body() dto: CreateAccessReviewDto,
  ) {
    return {
      success: true,
      review: this.service.createAccessReview(
        dto,
        "api",
      ),
    };
  }

  @Get("access-reviews")
  listAccessReviews() {
    return {
      success: true,
      reviews: this.service.listAccessReviews(),
    };
  }

  @Post("access-reviews/:reviewId/approve")
  approveAccessReview(
    @Param("reviewId") reviewId: string,
  ) {
    return {
      success: true,
      review: this.service.approveAccessReview(
        reviewId,
        "api",
      ),
    };
  }

  @Post("access-reviews/:reviewId/revoke")
  revokeAccessReview(
    @Param("reviewId") reviewId: string,
  ) {
    return {
      success: true,
      review: this.service.revokeAccessReview(
        reviewId,
        "api",
      ),
    };
  }

  @Post("privacy-requests")
  createPrivacyRequest(
    @Body() dto: CreatePrivacyRequestDto,
  ) {
    return {
      success: true,
      request: this.service.createPrivacyRequest(
        dto,
        "api",
      ),
    };
  }

  @Get("privacy-requests")
  listPrivacyRequests() {
    return {
      success: true,
      requests:
        this.service.listPrivacyRequests(),
    };
  }

  @Post("privacy-requests/:requestId/validate")
  validatePrivacyRequest(
    @Param("requestId") requestId: string,
  ) {
    return {
      success: true,
      request:
        this.service.validatePrivacyRequest(
          requestId,
          "api",
        ),
    };
  }

  @Post("privacy-requests/:requestId/complete")
  completePrivacyRequest(
    @Param("requestId") requestId: string,
  ) {
    return {
      success: true,
      request:
        this.service.completePrivacyRequest(
          requestId,
          "api",
        ),
    };
  }

  @Post("data-quality-rules")
  createDataQualityRule(
    @Body() dto: CreateDataQualityRuleDto,
  ) {
    return {
      success: true,
      rule: this.service.createDataQualityRule(
        dto,
        "api",
      ),
    };
  }

  @Get("data-quality-rules")
  listDataQualityRules() {
    return {
      success: true,
      rules:
        this.service.listDataQualityRules(),
    };
  }

  @Post("data-quality-rules/:ruleId/evaluate")
  evaluateDataQuality(
    @Param("ruleId") ruleId: string,
    @Body() dto: EvaluateDataQualityDto,
  ) {
    return {
      success: true,
      evaluation:
        this.service.evaluateDataQuality(
          ruleId,
          dto,
          "api",
        ),
    };
  }

  @Get("data-quality-evaluations")
  listDataQualityEvaluations() {
    return {
      success: true,
      evaluations:
        this.service.listDataQualityEvaluations(),
    };
  }
}
