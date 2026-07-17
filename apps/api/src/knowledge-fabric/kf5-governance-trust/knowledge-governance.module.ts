import { Module } from "@nestjs/common";
import { KnowledgeFoundationModule } from "../kf1-foundation";
import { KnowledgeIngestionModule } from "../kf2-ingestion-normalization";
import { KnowledgeGraphModule } from "../kf3-knowledge-graph";
import { KnowledgeRetrievalModule } from "../kf4-intelligence-retrieval";
import { KnowledgeAuditService } from "./knowledge-audit.service";
import { KnowledgeGovernanceController } from "./knowledge-governance.controller";
import { KnowledgeGovernanceRepository } from "./knowledge-governance.repository";
import { KnowledgeGovernanceService } from "./knowledge-governance.service";
import { KnowledgeTrustScoringService } from "./knowledge-trust-scoring.service";

@Module({
  imports: [KnowledgeFoundationModule, KnowledgeIngestionModule, KnowledgeGraphModule, KnowledgeRetrievalModule],
  controllers: [KnowledgeGovernanceController],
  providers: [KnowledgeGovernanceRepository, KnowledgeTrustScoringService, KnowledgeAuditService, KnowledgeGovernanceService],
  exports: [KnowledgeGovernanceService, KnowledgeTrustScoringService, KnowledgeAuditService],
})
export class KnowledgeGovernanceModule {}