import { Body, Controller, Get, Post } from "@nestjs/common";
import { EnterpriseKnowledgeFabricService } from "./enterprise-knowledge-fabric.service";
import { KnowledgeRepositoryService } from "./services/knowledge-repository.service";
import { KnowledgeDomainService } from "./services/knowledge-domain.service";
import { KnowledgeFederationService } from "./services/knowledge-federation.service";
import { ArchitectureMemoryService } from "./services/architecture-memory.service";
import { KnowledgeGraphNodeService } from "./services/knowledge-graph-node.service";
import { KnowledgeGraphEdgeService } from "./services/knowledge-graph-edge.service";
import { KnowledgeConstitutionService } from "./services/knowledge-constitution.service";
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
import { KnowledgeApiService } from "./services/knowledge-api.service";
import { ReasoningArchiveService } from "./services/reasoning-archive.service";
import { MemorySnapshotService } from "./services/memory-snapshot.service";
import { KnowledgeDashboardService } from "./services/knowledge-dashboard.service";

@Controller("enterprise-knowledge-fabric")
export class EnterpriseKnowledgeFabricController {
  constructor(
    private readonly os: EnterpriseKnowledgeFabricService,
    private readonly knowledge: KnowledgeRepositoryService,
    private readonly domains: KnowledgeDomainService,
    private readonly federation: KnowledgeFederationService,
    private readonly architectureMemory: ArchitectureMemoryService,
    private readonly graphNodes: KnowledgeGraphNodeService,
    private readonly graphEdges: KnowledgeGraphEdgeService,
    private readonly constitution: KnowledgeConstitutionService,
    private readonly courses: KnowledgeCourseService,
    private readonly enrollments: KnowledgeEnrollmentService,
    private readonly provenance: KnowledgeProvenanceService,
    private readonly sync: KnowledgeSyncService,
    private readonly versions: KnowledgeVersioningService,
    private readonly lineage: KnowledgeLineageService,
    private readonly semanticSearch: SemanticSearchService,
    private readonly relationships: KnowledgeRelationshipService,
    private readonly quality: KnowledgeQualityService,
    private readonly governance: KnowledgeGovernanceService,
    private readonly api: KnowledgeApiService,
    private readonly reasoningArchive: ReasoningArchiveService,
    private readonly memorySnapshots: MemorySnapshotService,
    private readonly dashboard: KnowledgeDashboardService,
  ) {}

  @Get("health") health(){ return this.os.health(); }
  @Post("knowledge") createKnowledge(@Body() body:any){ return {success:true,knowledge:this.knowledge.create(body)}; }
  @Post("domains") createDomain(@Body() body:any){ return {success:true,domain:this.domains.create(body)}; }
  @Post("federation") federateDomain(@Body() body:any){ return {success:true,federation:this.federation.create(body)}; }
  @Post("architecture-memory") architectureMemoryRecord(@Body() body:any){ return {success:true,memory:this.architectureMemory.create(body)}; }
  @Post("graph/nodes") graphNode(@Body() body:any){ return {success:true,node:this.graphNodes.create(body)}; }
  @Post("graph/edges") graphEdge(@Body() body:any){ return {success:true,edge:this.graphEdges.create(body)}; }
  @Post("constitution") knowledgeConstitution(@Body() body:any){ return {success:true,constitution:this.constitution.create(body)}; }
  @Post("academy/courses") academyCourse(@Body() body:any){ return {success:true,course:this.courses.create(body)}; }
  @Post("academy/enrollments") academyEnrollment(@Body() body:any){ return {success:true,enrollment:this.enrollments.create(body)}; }
  @Post("provenance") provenanceRecord(@Body() body:any){ return {success:true,provenance:this.provenance.create(body)}; }
  @Post("sync") syncKnowledge(@Body() body:any){ return {success:true,sync:this.sync.create(body)}; }
  @Post("versions") knowledgeVersion(@Body() body:any){ return {success:true,version:this.versions.create(body)}; }
  @Post("lineage") lineageLink(@Body() body:any){ return {success:true,lineage:this.lineage.create(body)}; }
  @Post("semantic-search") semanticSearchRun(@Body() body:any){ return {success:true,result:this.semanticSearch.create(body)}; }
  @Post("relationships") knowledgeRelationship(@Body() body:any){ return {success:true,relationship:this.relationships.create(body)}; }
  @Post("quality") qualityCheck(@Body() body:any){ return {success:true,quality:this.quality.create(body)}; }
  @Post("governance") governancePolicy(@Body() body:any){ return {success:true,governance:this.governance.create(body)}; }
  @Post("apis") knowledgeApi(@Body() body:any){ return {success:true,api:this.api.create(body)}; }
  @Post("reasoning-archive") reasoningArchiveEntry(@Body() body:any){ return {success:true,archive:this.reasoningArchive.create(body)}; }
  @Post("memory-snapshots") memorySnapshot(@Body() body:any){ return {success:true,snapshot:this.memorySnapshots.create(body)}; }
  @Get("operations/dashboard") operations(){ return {success:true,dashboard:this.dashboard.summary()}; }
}
