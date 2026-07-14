import { Module } from "@nestjs/common";
import { EnterpriseKnowledgeFabricController } from "./enterprise-knowledge-fabric.controller";
import { EnterpriseKnowledgeFabricService } from "./enterprise-knowledge-fabric.service";
import { KnowledgeRepositoryService } from "./services/knowledge-repository.service";
import { KnowledgeDomainService } from "./services/knowledge-domain.service";
import { KnowledgeFederationService } from "./services/knowledge-federation.service";
import { ArchitectureMemoryService } from "./services/architecture-memory.service";
import { KnowledgeGraphService } from "./services/knowledge-graph.service";
import { KnowledgeGraphNodeService } from "./services/knowledge-graph-node.service";
import { KnowledgeGraphEdgeService } from "./services/knowledge-graph-edge.service";
import { KnowledgeConstitutionService } from "./services/knowledge-constitution.service";
import { KnowledgeAcademyService } from "./services/knowledge-academy.service";
import { KnowledgeCourseService } from "./services/knowledge-course.service";
import { KnowledgeEnrollmentService } from "./services/knowledge-enrollment.service";
import { KnowledgeProvenanceService } from "./services/knowledge-provenance.service";
import { KnowledgeSyncService } from "./services/knowledge-sync.service";
import { KnowledgeVersioningService } from "./services/knowledge-versioning.service";
import { KnowledgeLineageService } from "./services/knowledge-lineage.service";
import { SemanticSearchService } from "./services/semantic-search.service";
import { KnowledgeRelationshipService } from "./services/knowledge-relationship.service";
import { KnowledgeQualityService } from "./services/knowledge-quality.service";
import { KnowledgeGovernanceService } from "./services/knowledge-governance.service";
import { KnowledgeAccessService } from "./services/knowledge-access.service";
import { KnowledgeApiService } from "./services/knowledge-api.service";
import { KnowledgeReportingService } from "./services/knowledge-reporting.service";
import { ReasoningArchiveService } from "./services/reasoning-archive.service";
import { MemorySnapshotService } from "./services/memory-snapshot.service";
import { KnowledgeDashboardService } from "./services/knowledge-dashboard.service";
import { KnowledgeFabricRuntime } from "./runtime/knowledge-fabric.runtime";
import { DomainFederationRuntime } from "./runtime/domain-federation.runtime";
import { ArchitectureMemoryRuntime } from "./runtime/architecture-memory.runtime";
import { KnowledgeGraphRuntime } from "./runtime/knowledge-graph.runtime";
import { ProvenanceRuntime } from "./runtime/provenance.runtime";
import { KnowledgeSyncRuntime } from "./runtime/knowledge-sync.runtime";
import { SemanticSearchRuntime } from "./runtime/semantic-search.runtime";
import { KnowledgeGovernanceRuntime } from "./runtime/knowledge-governance.runtime";

@Module({
  controllers:[EnterpriseKnowledgeFabricController],
  providers:[
    EnterpriseKnowledgeFabricService,
    KnowledgeRepositoryService,KnowledgeDomainService,KnowledgeFederationService,ArchitectureMemoryService,
    KnowledgeGraphService,KnowledgeGraphNodeService,KnowledgeGraphEdgeService,KnowledgeConstitutionService,
    KnowledgeAcademyService,KnowledgeCourseService,KnowledgeEnrollmentService,KnowledgeProvenanceService,
    KnowledgeSyncService,KnowledgeVersioningService,KnowledgeLineageService,SemanticSearchService,
    KnowledgeRelationshipService,KnowledgeQualityService,KnowledgeGovernanceService,KnowledgeAccessService,
    KnowledgeApiService,KnowledgeReportingService,ReasoningArchiveService,MemorySnapshotService,
    KnowledgeDashboardService,
    KnowledgeFabricRuntime,DomainFederationRuntime,ArchitectureMemoryRuntime,KnowledgeGraphRuntime,
    ProvenanceRuntime,KnowledgeSyncRuntime,SemanticSearchRuntime,KnowledgeGovernanceRuntime
  ],
  exports:[EnterpriseKnowledgeFabricService],
})
export class EnterpriseKnowledgeFabricModule {}
