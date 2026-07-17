import { Module } from "@nestjs/common";
import { KnowledgeFoundationModule } from "../kf1-foundation";
import { KnowledgeIngestionModule } from "../kf2-ingestion-normalization";
import { KnowledgeGraphModule } from "../kf3-knowledge-graph";
import { KnowledgeContextBuilderService } from "./knowledge-context-builder.service";
import { KnowledgeRankingService } from "./knowledge-ranking.service";
import { KnowledgeRetrievalController } from "./knowledge-retrieval.controller";
import { KnowledgeRetrievalRepository } from "./knowledge-retrieval.repository";
import { KnowledgeRetrievalService } from "./knowledge-retrieval.service";

@Module({
  imports: [KnowledgeFoundationModule, KnowledgeIngestionModule, KnowledgeGraphModule],
  controllers: [KnowledgeRetrievalController],
  providers: [KnowledgeRetrievalRepository, KnowledgeRankingService, KnowledgeContextBuilderService, KnowledgeRetrievalService],
  exports: [KnowledgeRetrievalService],
})
export class KnowledgeRetrievalModule {}