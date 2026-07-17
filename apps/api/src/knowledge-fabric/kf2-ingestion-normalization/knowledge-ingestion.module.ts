import { Module } from "@nestjs/common";
import { KnowledgeFoundationModule } from "../kf1-foundation";
import { KnowledgeIngestionController } from "./knowledge-ingestion.controller";
import { KnowledgeIngestionRepository } from "./knowledge-ingestion.repository";
import { KnowledgeIngestionService } from "./knowledge-ingestion.service";
import { KnowledgeNormalizationService } from "./knowledge-normalization.service";

@Module({
  imports: [KnowledgeFoundationModule],
  controllers: [KnowledgeIngestionController],
  providers: [
    KnowledgeIngestionRepository,
    KnowledgeNormalizationService,
    KnowledgeIngestionService,
  ],
  exports: [
    KnowledgeIngestionRepository,
    KnowledgeNormalizationService,
    KnowledgeIngestionService,
  ],
})
export class KnowledgeIngestionModule {}