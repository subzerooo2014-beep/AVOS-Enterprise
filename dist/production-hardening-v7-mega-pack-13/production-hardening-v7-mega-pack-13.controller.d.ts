import { CreateAccessReviewDto } from "./dto/create-access-review.dto";
import { CreateDataAssetDto } from "./dto/create-data-asset.dto";
import { CreateDataQualityRuleDto } from "./dto/create-data-quality-rule.dto";
import { CreateLineageEdgeDto } from "./dto/create-lineage-edge.dto";
import { CreateLineageNodeDto } from "./dto/create-lineage-node.dto";
import { CreatePrivacyRequestDto } from "./dto/create-privacy-request.dto";
import { CreateRetentionPolicyDto } from "./dto/create-retention-policy.dto";
import { EvaluateDataQualityDto } from "./dto/evaluate-data-quality.dto";
import { ProductionHardeningV7MegaPack13Service } from "./production-hardening-v7-mega-pack-13.service";
export declare class ProductionHardeningV7MegaPack13Controller {
    private readonly service;
    constructor(service: ProductionHardeningV7MegaPack13Service);
    status(): {
        generatedAt: string;
        healthStatus: "healthy" | "degraded" | "critical";
        evidenceChainVerified: boolean;
        dataAssets: number;
        activeDataAssets: number;
        restrictedDataAssets: number;
        personalDataAssets: number;
        retentionPolicies: number;
        activeRetentionPolicies: number;
        legalHolds: number;
        lineageNodes: number;
        lineageEdges: number;
        accessReviews: number;
        approvedAccessReviews: number;
        revokedAccessReviews: number;
        privacyRequests: number;
        completedPrivacyRequests: number;
        rejectedPrivacyRequests: number;
        dataQualityRules: number;
        activeDataQualityRules: number;
        dataQualityEvaluations: number;
        passedDataQualityEvaluations: number;
        failedDataQualityEvaluations: number;
        evidenceEntries: number;
        platformEvents: number;
        success: boolean;
        system: string;
        version: string;
    };
    snapshot(): {
        success: boolean;
        snapshot: import("./production-hardening-v7-mega-pack-13.types").DataGovernanceSnapshot;
    };
    verify(): {
        success: boolean;
        system: string;
        version: string;
        healthStatus: "critical" | "healthy" | "degraded";
        evidenceChainVerified: boolean;
        checks: {
            dataAssetGovernanceReady: boolean;
            retentionGovernanceReady: boolean;
            dataLineageReady: boolean;
            accessReviewReady: boolean;
            privacyRequestReady: boolean;
            dataQualityReady: boolean;
            noRejectedPrivacyRequests: boolean;
            noFailedQualityEvaluations: boolean;
            evidenceChainVerified: boolean;
            platformEventsReady: boolean;
        };
        snapshot: import("./production-hardening-v7-mega-pack-13.types").DataGovernanceSnapshot;
    };
    verifyEvidence(): {
        verified: boolean;
        entries: number;
        brokenAtSequence: number;
        checkedAt: string;
        success: boolean;
    } | {
        verified: boolean;
        entries: number;
        checkedAt: string;
        brokenAtSequence?: undefined;
        success: boolean;
    };
    evidence(): {
        success: boolean;
        entries: import("./production-hardening-v7-mega-pack-13.types").GovernanceEvidenceEntry[];
    };
    events(): {
        success: boolean;
        events: import("./production-hardening-v7-mega-pack-13.types").GovernancePlatformEvent[];
    };
    createDataAsset(dto: CreateDataAssetDto): {
        success: boolean;
        asset: import("./production-hardening-v7-mega-pack-13.types").DataAsset;
    };
    listDataAssets(): {
        success: boolean;
        assets: import("./production-hardening-v7-mega-pack-13.types").DataAsset[];
    };
    getDataAsset(assetId: string): {
        success: boolean;
        asset: import("./production-hardening-v7-mega-pack-13.types").DataAsset;
    };
    activateDataAsset(assetId: string): {
        success: boolean;
        asset: import("./production-hardening-v7-mega-pack-13.types").DataAsset;
    };
    createRetentionPolicy(dto: CreateRetentionPolicyDto): {
        success: boolean;
        policy: import("./production-hardening-v7-mega-pack-13.types").RetentionPolicy;
    };
    listRetentionPolicies(): {
        success: boolean;
        policies: import("./production-hardening-v7-mega-pack-13.types").RetentionPolicy[];
    };
    activateRetentionPolicy(policyId: string): {
        success: boolean;
        policy: import("./production-hardening-v7-mega-pack-13.types").RetentionPolicy;
    };
    createLineageNode(dto: CreateLineageNodeDto): {
        success: boolean;
        node: import("./production-hardening-v7-mega-pack-13.types").DataLineageNode;
    };
    listLineageNodes(assetId?: string): {
        success: boolean;
        nodes: import("./production-hardening-v7-mega-pack-13.types").DataLineageNode[];
    };
    createLineageEdge(dto: CreateLineageEdgeDto): {
        success: boolean;
        edge: import("./production-hardening-v7-mega-pack-13.types").DataLineageEdge;
    };
    listLineageEdges(assetId?: string): {
        success: boolean;
        edges: import("./production-hardening-v7-mega-pack-13.types").DataLineageEdge[];
    };
    createAccessReview(dto: CreateAccessReviewDto): {
        success: boolean;
        review: import("./production-hardening-v7-mega-pack-13.types").DataAccessReview;
    };
    listAccessReviews(): {
        success: boolean;
        reviews: import("./production-hardening-v7-mega-pack-13.types").DataAccessReview[];
    };
    approveAccessReview(reviewId: string): {
        success: boolean;
        review: import("./production-hardening-v7-mega-pack-13.types").DataAccessReview;
    };
    revokeAccessReview(reviewId: string): {
        success: boolean;
        review: import("./production-hardening-v7-mega-pack-13.types").DataAccessReview;
    };
    createPrivacyRequest(dto: CreatePrivacyRequestDto): {
        success: boolean;
        request: import("./production-hardening-v7-mega-pack-13.types").PrivacyRequest;
    };
    listPrivacyRequests(): {
        success: boolean;
        requests: import("./production-hardening-v7-mega-pack-13.types").PrivacyRequest[];
    };
    validatePrivacyRequest(requestId: string): {
        success: boolean;
        request: import("./production-hardening-v7-mega-pack-13.types").PrivacyRequest;
    };
    completePrivacyRequest(requestId: string): {
        success: boolean;
        request: import("./production-hardening-v7-mega-pack-13.types").PrivacyRequest;
    };
    createDataQualityRule(dto: CreateDataQualityRuleDto): {
        success: boolean;
        rule: import("./production-hardening-v7-mega-pack-13.types").DataQualityRule;
    };
    listDataQualityRules(): {
        success: boolean;
        rules: import("./production-hardening-v7-mega-pack-13.types").DataQualityRule[];
    };
    evaluateDataQuality(ruleId: string, dto: EvaluateDataQualityDto): {
        success: boolean;
        evaluation: import("./production-hardening-v7-mega-pack-13.types").DataQualityEvaluation;
    };
    listDataQualityEvaluations(): {
        success: boolean;
        evaluations: import("./production-hardening-v7-mega-pack-13.types").DataQualityEvaluation[];
    };
}
