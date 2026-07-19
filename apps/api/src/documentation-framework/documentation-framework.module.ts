import { DocumentationSemanticLinkService } from "./graph/documentation-semantic-link.service";
import { DocumentationKnowledgeSyncService } from "./graph/documentation-knowledge-sync.service";
import { DocumentationGraphVerificationService } from "./graph/documentation-graph-verification.service";
import { DocumentationGraphService } from "./graph/documentation-graph.service";
import { DocumentationGraphController } from "./graph/documentation-graph.controller";
import { Module } from "@nestjs/common";
import { DocumentationFrameworkController } from "./documentation-framework.controller";
import { DocumentationFrameworkService } from "./documentation-framework.service";
import { DocumentationGovernanceController } from "./documentation-governance.controller";
import { DocumentationGovernanceService } from "./documentation-governance.service";
import { DocumentationIntelligenceController } from "./documentation-intelligence.controller";
import { DocumentationIntelligenceOrchestratorService } from "./documentation-intelligence-orchestrator.service";
import { DocumentationRegistryService } from "./registry/documentation-registry.service";
import { DocumentationValidationService } from "./validation/documentation-validation.service";
import { DocumentationVersionService } from "./versioning/documentation-version.service";
import { DocumentationAuditService } from "./audit/documentation-audit.service";
import { DocumentationApprovalWorkflowService } from "./workflow/documentation-approval-workflow.service";
import { DocumentationLifecycleService } from "./lifecycle/documentation-lifecycle.service";
import { DocumentationCertificationService } from "./certification/documentation-certification.service";
import { DocumentationBlueprintSyncService } from "./blueprint/documentation-blueprint-sync.service";
import { LivingDocumentationService } from "./living/living-documentation.service";
import { DocumentationIntelligenceService } from "./intelligence/documentation-intelligence.service";

import { DocumentationAiModule } from "./documentation-ai/documentation-ai.module";
@Module({
  
  imports: [
    DocumentationAiModule,
  ],
controllers: [
    DocumentationFrameworkController,
    DocumentationGovernanceController,
    DocumentationIntelligenceController,
    DocumentationGraphController,
  ],
  providers: [
    DocumentationFrameworkService,
    DocumentationGovernanceService,
    DocumentationIntelligenceOrchestratorService,
    DocumentationRegistryService,
    DocumentationValidationService,
    DocumentationVersionService,
    DocumentationAuditService,
    DocumentationApprovalWorkflowService,
    DocumentationLifecycleService,
    DocumentationCertificationService,
    DocumentationBlueprintSyncService,
    LivingDocumentationService,
    DocumentationIntelligenceService,
    DocumentationSemanticLinkService,
    DocumentationKnowledgeSyncService,
    DocumentationGraphService,
    DocumentationGraphVerificationService,
  ],
  exports: [
    DocumentationFrameworkService,
    DocumentationGovernanceService,
    DocumentationIntelligenceOrchestratorService,
    DocumentationRegistryService,
    DocumentationValidationService,
    DocumentationVersionService,
    DocumentationAuditService,
    DocumentationApprovalWorkflowService,
    DocumentationLifecycleService,
    DocumentationCertificationService,
    DocumentationBlueprintSyncService,
    LivingDocumentationService,
    DocumentationIntelligenceService,
    DocumentationSemanticLinkService,
    DocumentationKnowledgeSyncService,
    DocumentationGraphService,
    DocumentationGraphVerificationService,
  ],
})
export class DocumentationFrameworkModule {}

