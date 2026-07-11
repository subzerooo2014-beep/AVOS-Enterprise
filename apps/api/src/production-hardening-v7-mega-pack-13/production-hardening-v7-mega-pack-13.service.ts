import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { createHash, randomUUID } from "crypto";
import { CreateAccessReviewDto } from "./dto/create-access-review.dto";
import { CreateDataAssetDto } from "./dto/create-data-asset.dto";
import { CreateDataQualityRuleDto } from "./dto/create-data-quality-rule.dto";
import { CreateLineageEdgeDto } from "./dto/create-lineage-edge.dto";
import { CreateLineageNodeDto } from "./dto/create-lineage-node.dto";
import { CreatePrivacyRequestDto } from "./dto/create-privacy-request.dto";
import { CreateRetentionPolicyDto } from "./dto/create-retention-policy.dto";
import { EvaluateDataQualityDto } from "./dto/evaluate-data-quality.dto";
import {
  DataAccessReview,
  DataAsset,
  DataGovernanceSnapshot,
  DataLineageEdge,
  DataLineageNode,
  DataQualityEvaluation,
  DataQualityRule,
  GovernanceEvidenceEntry,
  GovernancePlatformEvent,
  PrivacyRequest,
  RetentionPolicy,
} from "./production-hardening-v7-mega-pack-13.types";

@Injectable()
export class ProductionHardeningV7MegaPack13Service
  implements OnModuleInit
{
  private readonly assets = new Map<string, DataAsset>();
  private readonly retentionPolicies =
    new Map<string, RetentionPolicy>();
  private readonly lineageNodes =
    new Map<string, DataLineageNode>();
  private readonly lineageEdges =
    new Map<string, DataLineageEdge>();
  private readonly accessReviews =
    new Map<string, DataAccessReview>();
  private readonly privacyRequests =
    new Map<string, PrivacyRequest>();
  private readonly qualityRules =
    new Map<string, DataQualityRule>();
  private readonly qualityEvaluations =
    new Map<string, DataQualityEvaluation>();

  private readonly evidenceEntries: GovernanceEvidenceEntry[] = [];
  private readonly platformEvents: GovernancePlatformEvent[] = [];

  onModuleInit(): void {
    if (this.assets.size === 0) {
      this.seedDataGovernance();
    }
  }

  private now(): string {
    return new Date().toISOString();
  }

  private requireText(value: unknown, field: string): string {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new BadRequestException(`${field} is required`);
    }

    return value.trim();
  }

  private clamp(
    value: unknown,
    fallback: number,
    minimum: number,
    maximum: number,
  ): number {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      return fallback;
    }

    return Math.min(maximum, Math.max(minimum, parsed));
  }

  private stableSerialize(value: unknown): string {
    if (value === null || typeof value !== "object") {
      return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
      return `[${value
        .map((item) => this.stableSerialize(item))
        .join(",")}]`;
    }

    const record = value as Record<string, unknown>;

    return `{${Object.keys(record)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${this.stableSerialize(
            record[key],
          )}`,
      )
      .join(",")}}`;
  }

  private hash(value: unknown): string {
    return createHash("sha256")
      .update(this.stableSerialize(value))
      .digest("hex");
  }

  private record(
    eventType: string,
    entityType: string,
    entityId: string,
    actor: string,
    payload: Record<string, unknown> = {},
  ): GovernanceEvidenceEntry {
    const previous =
      this.evidenceEntries[this.evidenceEntries.length - 1];

    const sequence = this.evidenceEntries.length + 1;
    const previousHash = previous?.hash ?? "GENESIS";
    const timestamp = this.now();

    const hash = this.hash({
      sequence,
      eventType,
      entityType,
      entityId,
      actor,
      timestamp,
      payload,
      previousHash,
    });

    const evidence: GovernanceEvidenceEntry = {
      id: randomUUID(),
      sequence,
      eventType,
      entityType,
      entityId,
      actor,
      timestamp,
      payload,
      previousHash,
      hash,
    };

    this.evidenceEntries.push(evidence);

    this.platformEvents.push({
      id: randomUUID(),
      eventType,
      entityType,
      entityId,
      timestamp,
      payload,
    });

    return evidence;
  }

  createDataAsset(
    dto: CreateDataAssetDto,
    actor = "system",
  ): DataAsset {
    const createdAt = this.now();

    const asset: DataAsset = {
      id: randomUUID(),
      name: this.requireText(dto.name, "name"),
      description: dto.description?.trim() || "",
      domain: this.requireText(dto.domain, "domain"),
      owner: this.requireText(dto.owner, "owner"),
      steward: this.requireText(dto.steward, "steward"),
      classification: dto.classification,
      status: "draft",
      containsPersonalData: dto.containsPersonalData === true,
      containsSensitiveData:
        dto.containsSensitiveData === true,
      sourceSystem: this.requireText(
        dto.sourceSystem,
        "sourceSystem",
      ),
      storageLocation: this.requireText(
        dto.storageLocation,
        "storageLocation",
      ),
      tags: Array.from(
        new Set(
          (dto.tags ?? [])
            .map((tag) => tag.trim())
            .filter(Boolean),
        ),
      ),
      createdAt,
      updatedAt: createdAt,
    };

    this.assets.set(asset.id, asset);

    this.record(
      "governance.data_asset.created",
      "data_asset",
      asset.id,
      actor,
      {
        name: asset.name,
        domain: asset.domain,
        classification: asset.classification,
        containsPersonalData: asset.containsPersonalData,
      },
    );

    return asset;
  }

  activateDataAsset(
    assetId: string,
    actor = "system",
  ): DataAsset {
    const asset = this.getDataAsset(assetId);

    asset.status =
      asset.classification === "restricted"
        ? "restricted"
        : "active";

    asset.updatedAt = this.now();

    this.record(
      "governance.data_asset.activated",
      "data_asset",
      asset.id,
      actor,
      {
        status: asset.status,
        classification: asset.classification,
      },
    );

    return asset;
  }

  getDataAsset(assetId: string): DataAsset {
    const asset = this.assets.get(assetId);

    if (!asset) {
      throw new NotFoundException(
        `Data asset ${assetId} was not found`,
      );
    }

    return asset;
  }

  listDataAssets(): DataAsset[] {
    return Array.from(this.assets.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  createRetentionPolicy(
    dto: CreateRetentionPolicyDto,
    actor = "system",
  ): RetentionPolicy {
    const asset = this.getDataAsset(dto.assetId);
    const createdAt = this.now();

    const policy: RetentionPolicy = {
      id: randomUUID(),
      name: this.requireText(dto.name, "name"),
      assetId: asset.id,
      retentionDays: Math.round(
        this.clamp(dto.retentionDays, 365, 1, 36_500),
      ),
      legalHoldEnabled: dto.legalHoldEnabled === true,
      deletionEnabled: dto.deletionEnabled !== false,
      status: "draft",
      createdBy: dto.createdBy?.trim() || actor,
      createdAt,
      updatedAt: createdAt,
    };

    this.retentionPolicies.set(policy.id, policy);

    this.record(
      "governance.retention_policy.created",
      "retention_policy",
      policy.id,
      actor,
      {
        assetId: asset.id,
        retentionDays: policy.retentionDays,
        legalHoldEnabled: policy.legalHoldEnabled,
      },
    );

    return policy;
  }

  activateRetentionPolicy(
    policyId: string,
    actor = "system",
  ): RetentionPolicy {
    const policy = this.getRetentionPolicy(policyId);

    policy.status = "active";
    policy.activatedAt = this.now();
    policy.updatedAt = policy.activatedAt;

    this.record(
      "governance.retention_policy.activated",
      "retention_policy",
      policy.id,
      actor,
      {
        assetId: policy.assetId,
        activatedAt: policy.activatedAt,
      },
    );

    return policy;
  }

  getRetentionPolicy(policyId: string): RetentionPolicy {
    const policy = this.retentionPolicies.get(policyId);

    if (!policy) {
      throw new NotFoundException(
        `Retention policy ${policyId} was not found`,
      );
    }

    return policy;
  }

  listRetentionPolicies(): RetentionPolicy[] {
    return Array.from(
      this.retentionPolicies.values(),
    ).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  createLineageNode(
    dto: CreateLineageNodeDto,
    actor = "system",
  ): DataLineageNode {
    const asset = this.getDataAsset(dto.assetId);

    const node: DataLineageNode = {
      id: randomUUID(),
      assetId: asset.id,
      systemName: this.requireText(
        dto.systemName,
        "systemName",
      ),
      componentName: this.requireText(
        dto.componentName,
        "componentName",
      ),
      nodeType: dto.nodeType,
      createdAt: this.now(),
    };

    this.lineageNodes.set(node.id, node);

    this.record(
      "governance.lineage_node.created",
      "data_lineage_node",
      node.id,
      actor,
      {
        assetId: asset.id,
        nodeType: node.nodeType,
        systemName: node.systemName,
      },
    );

    return node;
  }

  createLineageEdge(
    dto: CreateLineageEdgeDto,
    actor = "system",
  ): DataLineageEdge {
    const asset = this.getDataAsset(dto.assetId);
    const fromNode = this.getLineageNode(dto.fromNodeId);
    const toNode = this.getLineageNode(dto.toNodeId);

    if (
      fromNode.assetId !== asset.id ||
      toNode.assetId !== asset.id
    ) {
      throw new BadRequestException(
        "Lineage nodes must belong to the same data asset",
      );
    }

    const edge: DataLineageEdge = {
      id: randomUUID(),
      assetId: asset.id,
      fromNodeId: fromNode.id,
      toNodeId: toNode.id,
      transformation:
        dto.transformation?.trim() || "direct_transfer",
      encrypted: dto.encrypted !== false,
      createdAt: this.now(),
    };

    this.lineageEdges.set(edge.id, edge);

    this.record(
      "governance.lineage_edge.created",
      "data_lineage_edge",
      edge.id,
      actor,
      {
        assetId: asset.id,
        fromNodeId: edge.fromNodeId,
        toNodeId: edge.toNodeId,
        encrypted: edge.encrypted,
      },
    );

    return edge;
  }

  getLineageNode(nodeId: string): DataLineageNode {
    const node = this.lineageNodes.get(nodeId);

    if (!node) {
      throw new NotFoundException(
        `Lineage node ${nodeId} was not found`,
      );
    }

    return node;
  }

  listLineageNodes(assetId?: string): DataLineageNode[] {
    return Array.from(this.lineageNodes.values())
      .filter((node) => !assetId || node.assetId === assetId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  listLineageEdges(assetId?: string): DataLineageEdge[] {
    return Array.from(this.lineageEdges.values())
      .filter((edge) => !assetId || edge.assetId === assetId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  createAccessReview(
    dto: CreateAccessReviewDto,
    actor = "system",
  ): DataAccessReview {
    const asset = this.getDataAsset(dto.assetId);

    const review: DataAccessReview = {
      id: randomUUID(),
      assetId: asset.id,
      principal: this.requireText(
        dto.principal,
        "principal",
      ),
      role: this.requireText(dto.role, "role"),
      businessJustification: this.requireText(
        dto.businessJustification,
        "businessJustification",
      ),
      status: "pending",
      expiresAt: dto.expiresAt,
      createdAt: this.now(),
    };

    this.accessReviews.set(review.id, review);

    this.record(
      "governance.access_review.created",
      "data_access_review",
      review.id,
      actor,
      {
        assetId: asset.id,
        principal: review.principal,
        role: review.role,
      },
    );

    return review;
  }

  approveAccessReview(
    reviewId: string,
    reviewedBy = "system",
  ): DataAccessReview {
    const review = this.getAccessReview(reviewId);

    review.status = "approved";
    review.reviewedBy = reviewedBy;
    review.reviewedAt = this.now();

    this.record(
      "governance.access_review.approved",
      "data_access_review",
      review.id,
      reviewedBy,
      {
        assetId: review.assetId,
        principal: review.principal,
      },
    );

    return review;
  }

  revokeAccessReview(
    reviewId: string,
    reviewedBy = "system",
  ): DataAccessReview {
    const review = this.getAccessReview(reviewId);

    review.status = "revoked";
    review.reviewedBy = reviewedBy;
    review.reviewedAt = this.now();

    this.record(
      "governance.access_review.revoked",
      "data_access_review",
      review.id,
      reviewedBy,
      {
        assetId: review.assetId,
        principal: review.principal,
      },
    );

    return review;
  }

  getAccessReview(reviewId: string): DataAccessReview {
    const review = this.accessReviews.get(reviewId);

    if (!review) {
      throw new NotFoundException(
        `Access review ${reviewId} was not found`,
      );
    }

    return review;
  }

  listAccessReviews(): DataAccessReview[] {
    return Array.from(this.accessReviews.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  createPrivacyRequest(
    dto: CreatePrivacyRequestDto,
    actor = "system",
  ): PrivacyRequest {
    if (!Array.isArray(dto.assetIds) || dto.assetIds.length === 0) {
      throw new BadRequestException(
        "assetIds must contain at least one data asset",
      );
    }

    for (const assetId of dto.assetIds) {
      this.getDataAsset(assetId);
    }

    const request: PrivacyRequest = {
      id: randomUUID(),
      subjectReference: this.requireText(
        dto.subjectReference,
        "subjectReference",
      ),
      requestType: dto.requestType,
      assetIds: Array.from(new Set(dto.assetIds)),
      status: "received",
      requestedAt: this.now(),
      requestedBy: dto.requestedBy?.trim() || actor,
    };

    this.privacyRequests.set(request.id, request);

    this.record(
      "governance.privacy_request.received",
      "privacy_request",
      request.id,
      actor,
      {
        requestType: request.requestType,
        assets: request.assetIds.length,
      },
    );

    return request;
  }

  validatePrivacyRequest(
    requestId: string,
    actor = "system",
  ): PrivacyRequest {
    const request = this.getPrivacyRequest(requestId);

    request.status = "validated";
    request.validatedAt = this.now();

    this.record(
      "governance.privacy_request.validated",
      "privacy_request",
      request.id,
      actor,
      {
        requestType: request.requestType,
      },
    );

    return request;
  }

  completePrivacyRequest(
    requestId: string,
    actor = "system",
  ): PrivacyRequest {
    const request = this.getPrivacyRequest(requestId);

    if (
      request.status !== "validated" &&
      request.status !== "processing"
    ) {
      throw new BadRequestException(
        "Privacy request must be validated before completion",
      );
    }

    request.status = "completed";
    request.completedAt = this.now();

    this.record(
      "governance.privacy_request.completed",
      "privacy_request",
      request.id,
      actor,
      {
        requestType: request.requestType,
        completedAt: request.completedAt,
      },
    );

    return request;
  }

  getPrivacyRequest(requestId: string): PrivacyRequest {
    const request = this.privacyRequests.get(requestId);

    if (!request) {
      throw new NotFoundException(
        `Privacy request ${requestId} was not found`,
      );
    }

    return request;
  }

  listPrivacyRequests(): PrivacyRequest[] {
    return Array.from(
      this.privacyRequests.values(),
    ).sort((a, b) =>
      b.requestedAt.localeCompare(a.requestedAt),
    );
  }

  createDataQualityRule(
    dto: CreateDataQualityRuleDto,
    actor = "system",
  ): DataQualityRule {
    const asset = this.getDataAsset(dto.assetId);

    const rule: DataQualityRule = {
      id: randomUUID(),
      assetId: asset.id,
      name: this.requireText(dto.name, "name"),
      fieldName: this.requireText(
        dto.fieldName,
        "fieldName",
      ),
      ruleType: dto.ruleType,
      thresholdPercent: this.clamp(
        dto.thresholdPercent,
        95,
        0,
        100,
      ),
      active: true,
      createdAt: this.now(),
    };

    this.qualityRules.set(rule.id, rule);

    this.record(
      "governance.data_quality_rule.created",
      "data_quality_rule",
      rule.id,
      actor,
      {
        assetId: asset.id,
        ruleType: rule.ruleType,
        thresholdPercent: rule.thresholdPercent,
      },
    );

    return rule;
  }

  evaluateDataQuality(
    ruleId: string,
    dto: EvaluateDataQualityDto,
    actor = "system",
  ): DataQualityEvaluation {
    const rule = this.getDataQualityRule(ruleId);

    const measuredPercent = this.clamp(
      dto.measuredPercent,
      0,
      0,
      100,
    );

    const passed = measuredPercent >= rule.thresholdPercent;

    const evaluation: DataQualityEvaluation = {
      id: randomUUID(),
      ruleId: rule.id,
      assetId: rule.assetId,
      measuredPercent,
      passed,
      message:
        dto.message?.trim() ||
        (passed
          ? "Data quality threshold passed"
          : "Data quality threshold failed"),
      evaluatedAt: this.now(),
    };

    this.qualityEvaluations.set(
      evaluation.id,
      evaluation,
    );

    this.record(
      passed
        ? "governance.data_quality.passed"
        : "governance.data_quality.failed",
      "data_quality_evaluation",
      evaluation.id,
      actor,
      {
        ruleId: rule.id,
        assetId: rule.assetId,
        measuredPercent,
        thresholdPercent: rule.thresholdPercent,
      },
    );

    return evaluation;
  }

  getDataQualityRule(ruleId: string): DataQualityRule {
    const rule = this.qualityRules.get(ruleId);

    if (!rule) {
      throw new NotFoundException(
        `Data quality rule ${ruleId} was not found`,
      );
    }

    return rule;
  }

  listDataQualityRules(): DataQualityRule[] {
    return Array.from(this.qualityRules.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  listDataQualityEvaluations():
    DataQualityEvaluation[] {
    return Array.from(
      this.qualityEvaluations.values(),
    ).sort((a, b) =>
      b.evaluatedAt.localeCompare(a.evaluatedAt),
    );
  }

  verifyEvidenceChain() {
    let previousHash = "GENESIS";

    for (const entry of this.evidenceEntries) {
      const calculatedHash = this.hash({
        sequence: entry.sequence,
        eventType: entry.eventType,
        entityType: entry.entityType,
        entityId: entry.entityId,
        actor: entry.actor,
        timestamp: entry.timestamp,
        payload: entry.payload,
        previousHash: entry.previousHash,
      });

      if (
        entry.previousHash !== previousHash ||
        entry.hash !== calculatedHash
      ) {
        return {
          verified: false,
          entries: this.evidenceEntries.length,
          brokenAtSequence: entry.sequence,
          checkedAt: this.now(),
        };
      }

      previousHash = entry.hash;
    }

    return {
      verified: true,
      entries: this.evidenceEntries.length,
      checkedAt: this.now(),
    };
  }

  listEvidenceEntries(): GovernanceEvidenceEntry[] {
    return [...this.evidenceEntries];
  }

  listPlatformEvents(): GovernancePlatformEvent[] {
    return [...this.platformEvents].sort((a, b) =>
      b.timestamp.localeCompare(a.timestamp),
    );
  }

  getSnapshot(): DataGovernanceSnapshot {
    const assets = this.listDataAssets();
    const retentionPolicies =
      this.listRetentionPolicies();
    const lineageNodes = this.listLineageNodes();
    const lineageEdges = this.listLineageEdges();
    const accessReviews = this.listAccessReviews();
    const privacyRequests =
      this.listPrivacyRequests();
    const qualityRules = this.listDataQualityRules();
    const qualityEvaluations =
      this.listDataQualityEvaluations();

    const evidence = this.verifyEvidenceChain();

    const failedDataQualityEvaluations =
      qualityEvaluations.filter(
        (evaluation) => !evaluation.passed,
      ).length;

    const rejectedPrivacyRequests =
      privacyRequests.filter(
        (request) => request.status === "rejected",
      ).length;

    const healthStatus: DataGovernanceSnapshot["healthStatus"] =
      !evidence.verified ||
      rejectedPrivacyRequests > 0
        ? "critical"
        : failedDataQualityEvaluations > 0
          ? "degraded"
          : "healthy";

    return {
      generatedAt: this.now(),
      healthStatus,
      evidenceChainVerified: evidence.verified,
      dataAssets: assets.length,
      activeDataAssets: assets.filter(
        (asset) => asset.status === "active",
      ).length,
      restrictedDataAssets: assets.filter(
        (asset) => asset.status === "restricted",
      ).length,
      personalDataAssets: assets.filter(
        (asset) => asset.containsPersonalData,
      ).length,
      retentionPolicies: retentionPolicies.length,
      activeRetentionPolicies:
        retentionPolicies.filter(
          (policy) => policy.status === "active",
        ).length,
      legalHolds: retentionPolicies.filter(
        (policy) => policy.legalHoldEnabled,
      ).length,
      lineageNodes: lineageNodes.length,
      lineageEdges: lineageEdges.length,
      accessReviews: accessReviews.length,
      approvedAccessReviews: accessReviews.filter(
        (review) => review.status === "approved",
      ).length,
      revokedAccessReviews: accessReviews.filter(
        (review) => review.status === "revoked",
      ).length,
      privacyRequests: privacyRequests.length,
      completedPrivacyRequests:
        privacyRequests.filter(
          (request) => request.status === "completed",
        ).length,
      rejectedPrivacyRequests,
      dataQualityRules: qualityRules.length,
      activeDataQualityRules:
        qualityRules.filter((rule) => rule.active).length,
      dataQualityEvaluations:
        qualityEvaluations.length,
      passedDataQualityEvaluations:
        qualityEvaluations.filter(
          (evaluation) => evaluation.passed,
        ).length,
      failedDataQualityEvaluations,
      evidenceEntries: this.evidenceEntries.length,
      platformEvents: this.platformEvents.length,
    };
  }

  getStatus() {
    return {
      success: true,
      system:
        "AVOS Production Hardening V7 — Mega Pack 13",
      version: "v7-mega-pack-13",
      ...this.getSnapshot(),
    };
  }

  runVerification() {
    const snapshot = this.getSnapshot();

    const checks = {
      dataAssetGovernanceReady:
        snapshot.dataAssets > 0 &&
        snapshot.activeDataAssets > 0,
      retentionGovernanceReady:
        snapshot.retentionPolicies > 0 &&
        snapshot.activeRetentionPolicies > 0,
      dataLineageReady:
        snapshot.lineageNodes >= 2 &&
        snapshot.lineageEdges > 0,
      accessReviewReady:
        snapshot.accessReviews > 0 &&
        snapshot.approvedAccessReviews > 0,
      privacyRequestReady:
        snapshot.privacyRequests > 0 &&
        snapshot.completedPrivacyRequests > 0,
      dataQualityReady:
        snapshot.dataQualityRules > 0 &&
        snapshot.dataQualityEvaluations > 0 &&
        snapshot.passedDataQualityEvaluations > 0,
      noRejectedPrivacyRequests:
        snapshot.rejectedPrivacyRequests === 0,
      noFailedQualityEvaluations:
        snapshot.failedDataQualityEvaluations === 0,
      evidenceChainVerified:
        snapshot.evidenceChainVerified,
      platformEventsReady:
        snapshot.platformEvents > 0,
    };

    return {
      success: Object.values(checks).every(Boolean),
      system:
        "AVOS Production Hardening V7 — Mega Pack 13",
      version: "v7-mega-pack-13",
      healthStatus: snapshot.healthStatus,
      evidenceChainVerified:
        snapshot.evidenceChainVerified,
      checks,
      snapshot,
    };
  }

  private seedDataGovernance(): void {
    const asset = this.createDataAsset(
      {
        name: "AVOS Customer Master Data",
        description:
          "Governed enterprise customer and account data",
        domain: "customer",
        owner: "enterprise-data-owner",
        steward: "customer-data-steward",
        classification: "confidential",
        containsPersonalData: true,
        containsSensitiveData: false,
        sourceSystem: "avos-api",
        storageLocation: "postgresql-primary",
        tags: [
          "customer",
          "privacy",
          "governed",
          "production",
        ],
      },
      "mega-pack-13-seed",
    );

    this.activateDataAsset(
      asset.id,
      "mega-pack-13-seed",
    );

    const retentionPolicy =
      this.createRetentionPolicy(
        {
          assetId: asset.id,
          name: "AVOS Customer Data Retention",
          retentionDays: 2555,
          legalHoldEnabled: false,
          deletionEnabled: true,
          createdBy: "mega-pack-13-seed",
        },
        "mega-pack-13-seed",
      );

    this.activateRetentionPolicy(
      retentionPolicy.id,
      "mega-pack-13-seed",
    );

    const sourceNode = this.createLineageNode(
      {
        assetId: asset.id,
        systemName: "avos-api",
        componentName: "customer-service",
        nodeType: "source",
      },
      "mega-pack-13-seed",
    );

    const storeNode = this.createLineageNode(
      {
        assetId: asset.id,
        systemName: "postgresql-primary",
        componentName: "customer-table",
        nodeType: "store",
      },
      "mega-pack-13-seed",
    );

    this.createLineageEdge(
      {
        assetId: asset.id,
        fromNodeId: sourceNode.id,
        toNodeId: storeNode.id,
        transformation: "validated_customer_write",
        encrypted: true,
      },
      "mega-pack-13-seed",
    );

    const accessReview = this.createAccessReview(
      {
        assetId: asset.id,
        principal: "customer-operations-service",
        role: "customer-data-operator",
        businessJustification:
          "Required for authorized customer operations",
      },
      "mega-pack-13-seed",
    );

    this.approveAccessReview(
      accessReview.id,
      "mega-pack-13-seed",
    );

    const privacyRequest =
      this.createPrivacyRequest(
        {
          subjectReference:
            "privacy-validation-subject",
          requestType: "access",
          assetIds: [asset.id],
          requestedBy: "mega-pack-13-seed",
        },
        "mega-pack-13-seed",
      );

    this.validatePrivacyRequest(
      privacyRequest.id,
      "mega-pack-13-seed",
    );

    this.completePrivacyRequest(
      privacyRequest.id,
      "mega-pack-13-seed",
    );

    const qualityRule =
      this.createDataQualityRule(
        {
          assetId: asset.id,
          name: "Customer Email Completeness",
          fieldName: "email",
          ruleType: "required",
          thresholdPercent: 95,
        },
        "mega-pack-13-seed",
      );

    this.evaluateDataQuality(
      qualityRule.id,
      {
        measuredPercent: 99.5,
        message:
          "Customer email completeness passed",
      },
      "mega-pack-13-seed",
    );
  }
}
