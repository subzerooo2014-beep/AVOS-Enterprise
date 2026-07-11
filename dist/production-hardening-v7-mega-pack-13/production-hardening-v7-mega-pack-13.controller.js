"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV7MegaPack13Controller = void 0;
const common_1 = require("@nestjs/common");
const create_access_review_dto_1 = require("./dto/create-access-review.dto");
const create_data_asset_dto_1 = require("./dto/create-data-asset.dto");
const create_data_quality_rule_dto_1 = require("./dto/create-data-quality-rule.dto");
const create_lineage_edge_dto_1 = require("./dto/create-lineage-edge.dto");
const create_lineage_node_dto_1 = require("./dto/create-lineage-node.dto");
const create_privacy_request_dto_1 = require("./dto/create-privacy-request.dto");
const create_retention_policy_dto_1 = require("./dto/create-retention-policy.dto");
const evaluate_data_quality_dto_1 = require("./dto/evaluate-data-quality.dto");
const production_hardening_v7_mega_pack_13_service_1 = require("./production-hardening-v7-mega-pack-13.service");
let ProductionHardeningV7MegaPack13Controller = class ProductionHardeningV7MegaPack13Controller {
    constructor(service) {
        this.service = service;
    }
    status() {
        return this.service.getStatus();
    }
    snapshot() {
        return {
            success: true,
            snapshot: this.service.getSnapshot(),
        };
    }
    verify() {
        return this.service.runVerification();
    }
    verifyEvidence() {
        return {
            success: true,
            ...this.service.verifyEvidenceChain(),
        };
    }
    evidence() {
        return {
            success: true,
            entries: this.service.listEvidenceEntries(),
        };
    }
    events() {
        return {
            success: true,
            events: this.service.listPlatformEvents(),
        };
    }
    createDataAsset(dto) {
        return {
            success: true,
            asset: this.service.createDataAsset(dto, "api"),
        };
    }
    listDataAssets() {
        return {
            success: true,
            assets: this.service.listDataAssets(),
        };
    }
    getDataAsset(assetId) {
        return {
            success: true,
            asset: this.service.getDataAsset(assetId),
        };
    }
    activateDataAsset(assetId) {
        return {
            success: true,
            asset: this.service.activateDataAsset(assetId, "api"),
        };
    }
    createRetentionPolicy(dto) {
        return {
            success: true,
            policy: this.service.createRetentionPolicy(dto, "api"),
        };
    }
    listRetentionPolicies() {
        return {
            success: true,
            policies: this.service.listRetentionPolicies(),
        };
    }
    activateRetentionPolicy(policyId) {
        return {
            success: true,
            policy: this.service.activateRetentionPolicy(policyId, "api"),
        };
    }
    createLineageNode(dto) {
        return {
            success: true,
            node: this.service.createLineageNode(dto, "api"),
        };
    }
    listLineageNodes(assetId) {
        return {
            success: true,
            nodes: this.service.listLineageNodes(assetId),
        };
    }
    createLineageEdge(dto) {
        return {
            success: true,
            edge: this.service.createLineageEdge(dto, "api"),
        };
    }
    listLineageEdges(assetId) {
        return {
            success: true,
            edges: this.service.listLineageEdges(assetId),
        };
    }
    createAccessReview(dto) {
        return {
            success: true,
            review: this.service.createAccessReview(dto, "api"),
        };
    }
    listAccessReviews() {
        return {
            success: true,
            reviews: this.service.listAccessReviews(),
        };
    }
    approveAccessReview(reviewId) {
        return {
            success: true,
            review: this.service.approveAccessReview(reviewId, "api"),
        };
    }
    revokeAccessReview(reviewId) {
        return {
            success: true,
            review: this.service.revokeAccessReview(reviewId, "api"),
        };
    }
    createPrivacyRequest(dto) {
        return {
            success: true,
            request: this.service.createPrivacyRequest(dto, "api"),
        };
    }
    listPrivacyRequests() {
        return {
            success: true,
            requests: this.service.listPrivacyRequests(),
        };
    }
    validatePrivacyRequest(requestId) {
        return {
            success: true,
            request: this.service.validatePrivacyRequest(requestId, "api"),
        };
    }
    completePrivacyRequest(requestId) {
        return {
            success: true,
            request: this.service.completePrivacyRequest(requestId, "api"),
        };
    }
    createDataQualityRule(dto) {
        return {
            success: true,
            rule: this.service.createDataQualityRule(dto, "api"),
        };
    }
    listDataQualityRules() {
        return {
            success: true,
            rules: this.service.listDataQualityRules(),
        };
    }
    evaluateDataQuality(ruleId, dto) {
        return {
            success: true,
            evaluation: this.service.evaluateDataQuality(ruleId, dto, "api"),
        };
    }
    listDataQualityEvaluations() {
        return {
            success: true,
            evaluations: this.service.listDataQualityEvaluations(),
        };
    }
};
exports.ProductionHardeningV7MegaPack13Controller = ProductionHardeningV7MegaPack13Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "status", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "snapshot", null);
__decorate([
    (0, common_1.Get)("verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "verify", null);
__decorate([
    (0, common_1.Get)("evidence/verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "verifyEvidence", null);
__decorate([
    (0, common_1.Get)("evidence"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "evidence", null);
__decorate([
    (0, common_1.Get)("events"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "events", null);
__decorate([
    (0, common_1.Post)("data-assets"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_data_asset_dto_1.CreateDataAssetDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "createDataAsset", null);
__decorate([
    (0, common_1.Get)("data-assets"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "listDataAssets", null);
__decorate([
    (0, common_1.Get)("data-assets/:assetId"),
    __param(0, (0, common_1.Param)("assetId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "getDataAsset", null);
__decorate([
    (0, common_1.Post)("data-assets/:assetId/activate"),
    __param(0, (0, common_1.Param)("assetId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "activateDataAsset", null);
__decorate([
    (0, common_1.Post)("retention-policies"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_retention_policy_dto_1.CreateRetentionPolicyDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "createRetentionPolicy", null);
__decorate([
    (0, common_1.Get)("retention-policies"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "listRetentionPolicies", null);
__decorate([
    (0, common_1.Post)("retention-policies/:policyId/activate"),
    __param(0, (0, common_1.Param)("policyId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "activateRetentionPolicy", null);
__decorate([
    (0, common_1.Post)("lineage/nodes"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lineage_node_dto_1.CreateLineageNodeDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "createLineageNode", null);
__decorate([
    (0, common_1.Get)("lineage/nodes"),
    __param(0, (0, common_1.Query)("assetId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "listLineageNodes", null);
__decorate([
    (0, common_1.Post)("lineage/edges"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lineage_edge_dto_1.CreateLineageEdgeDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "createLineageEdge", null);
__decorate([
    (0, common_1.Get)("lineage/edges"),
    __param(0, (0, common_1.Query)("assetId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "listLineageEdges", null);
__decorate([
    (0, common_1.Post)("access-reviews"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_access_review_dto_1.CreateAccessReviewDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "createAccessReview", null);
__decorate([
    (0, common_1.Get)("access-reviews"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "listAccessReviews", null);
__decorate([
    (0, common_1.Post)("access-reviews/:reviewId/approve"),
    __param(0, (0, common_1.Param)("reviewId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "approveAccessReview", null);
__decorate([
    (0, common_1.Post)("access-reviews/:reviewId/revoke"),
    __param(0, (0, common_1.Param)("reviewId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "revokeAccessReview", null);
__decorate([
    (0, common_1.Post)("privacy-requests"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_privacy_request_dto_1.CreatePrivacyRequestDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "createPrivacyRequest", null);
__decorate([
    (0, common_1.Get)("privacy-requests"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "listPrivacyRequests", null);
__decorate([
    (0, common_1.Post)("privacy-requests/:requestId/validate"),
    __param(0, (0, common_1.Param)("requestId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "validatePrivacyRequest", null);
__decorate([
    (0, common_1.Post)("privacy-requests/:requestId/complete"),
    __param(0, (0, common_1.Param)("requestId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "completePrivacyRequest", null);
__decorate([
    (0, common_1.Post)("data-quality-rules"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_data_quality_rule_dto_1.CreateDataQualityRuleDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "createDataQualityRule", null);
__decorate([
    (0, common_1.Get)("data-quality-rules"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "listDataQualityRules", null);
__decorate([
    (0, common_1.Post)("data-quality-rules/:ruleId/evaluate"),
    __param(0, (0, common_1.Param)("ruleId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, evaluate_data_quality_dto_1.EvaluateDataQualityDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "evaluateDataQuality", null);
__decorate([
    (0, common_1.Get)("data-quality-evaluations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack13Controller.prototype, "listDataQualityEvaluations", null);
exports.ProductionHardeningV7MegaPack13Controller = ProductionHardeningV7MegaPack13Controller = __decorate([
    (0, common_1.Controller)("production-hardening-v7-mega-pack-13"),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_13_service_1.ProductionHardeningV7MegaPack13Service])
], ProductionHardeningV7MegaPack13Controller);
//# sourceMappingURL=production-hardening-v7-mega-pack-13.controller.js.map