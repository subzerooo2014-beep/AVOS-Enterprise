import { Module } from "@nestjs/common";
import { KnowledgeFoundationModule } from "../kf1-foundation";
import { KnowledgeIngestionModule } from "../kf2-ingestion-normalization";
import { KnowledgeGraphController } from "./knowledge-graph.controller";
import { KnowledgeGraphIntegrityService } from "./knowledge-graph-integrity.service";
import { KnowledgeGraphRepository } from "./knowledge-graph.repository";
import { KnowledgeGraphService } from "./knowledge-graph.service";
import { KnowledgeGraphTraversalService } from "./knowledge-graph-traversal.service";

@Module({
  imports: [KnowledgeFoundationModule, KnowledgeIngestionModule],
  controllers: [KnowledgeGraphController],
  providers: [KnowledgeGraphRepository, KnowledgeGraphTraversalService, KnowledgeGraphIntegrityService, KnowledgeGraphService],
  exports: [KnowledgeGraphRepository, KnowledgeGraphTraversalService, KnowledgeGraphIntegrityService, KnowledgeGraphService],
})
export class KnowledgeGraphModule {}