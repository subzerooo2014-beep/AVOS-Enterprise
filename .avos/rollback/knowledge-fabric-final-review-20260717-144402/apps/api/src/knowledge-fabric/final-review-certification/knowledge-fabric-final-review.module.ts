import { Module } from "@nestjs/common";
import { KnowledgeFoundationModule } from "../kf1-foundation";
import { KnowledgeIngestionModule } from "../kf2-ingestion-normalization";
import { KnowledgeGraphModule } from "../kf3-knowledge-graph";
import { KnowledgeRetrievalModule } from "../kf4-intelligence-retrieval";
import { KnowledgeGovernanceModule } from "../kf5-governance-trust";
import { KnowledgeFabricFinalReviewController } from "./knowledge-fabric-final-review.controller";
import { KnowledgeFabricFinalReviewService } from "./knowledge-fabric-final-review.service";

@Module({
  imports: [
    KnowledgeFoundationModule,
    KnowledgeIngestionModule,
    KnowledgeGraphModule,
    KnowledgeRetrievalModule,
    KnowledgeGovernanceModule,
  ],
  controllers: [KnowledgeFabricFinalReviewController],
  providers: [KnowledgeFabricFinalReviewService],
  exports: [KnowledgeFabricFinalReviewService],
})
export class KnowledgeFabricFinalReviewModule {}