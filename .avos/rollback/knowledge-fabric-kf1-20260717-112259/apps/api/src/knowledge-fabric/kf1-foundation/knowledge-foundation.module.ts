import { Module } from "@nestjs/common";
import { KnowledgeFoundationController } from "./knowledge-foundation.controller";
import { KnowledgeFoundationRepository } from "./knowledge-foundation.repository";
import { KnowledgeFoundationService } from "./knowledge-foundation.service";
import { KnowledgeRegistryService } from "./knowledge-registry.service";

@Module({
  controllers: [KnowledgeFoundationController],
  providers: [
    KnowledgeFoundationRepository,
    KnowledgeRegistryService,
    KnowledgeFoundationService,
  ],
  exports: [KnowledgeRegistryService, KnowledgeFoundationService],
})
export class KnowledgeFoundationModule {}