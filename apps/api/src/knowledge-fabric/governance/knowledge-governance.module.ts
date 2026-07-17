
import { Module } from "@nestjs/common";
import { KnowledgeApprovalService } from "./knowledge-approval.service";
import { KnowledgeAuditService } from "./knowledge-audit.service";
import { KnowledgeComplianceService } from "./knowledge-compliance.service";
import { KnowledgeGovernanceController } from "./knowledge-governance.controller";
import { KnowledgeGovernanceEngineService } from "./knowledge-governance-engine.service";
import { KnowledgeGovernanceHealthService } from "./knowledge-governance-health.service";
import { KnowledgeGovernanceMetricsService } from "./knowledge-governance-metrics.service";
import { KnowledgeLifecycleService } from "./knowledge-lifecycle.service";
import { KnowledgePolicyEngineService } from "./knowledge-policy-engine.service";
import { KnowledgeQualityService } from "./knowledge-quality.service";
import { KnowledgeRetentionService } from "./knowledge-retention.service";

const providers = [KnowledgePolicyEngineService, KnowledgeQualityService, KnowledgeApprovalService, KnowledgeAuditService, KnowledgeRetentionService, KnowledgeComplianceService, KnowledgeLifecycleService, KnowledgeGovernanceMetricsService, KnowledgeGovernanceEngineService, KnowledgeGovernanceHealthService];

@Module({ controllers: [KnowledgeGovernanceController], providers, exports: providers })
export class KnowledgeGovernanceModule {}