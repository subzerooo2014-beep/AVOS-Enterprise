import { Module } from "@nestjs/common";
import { KnowledgeChecksumService } from "./knowledge-checksum.service";
import { KnowledgeFabricController } from "./knowledge-fabric.controller";
import { KnowledgeFoundationService } from "./knowledge-foundation.service";
import { KnowledgeGraphService } from "./knowledge-graph.service";
import { KnowledgeRegistryService } from "./knowledge-registry.service";
import { KnowledgeValidatorService } from "./knowledge-validator.service";

@Module({
  controllers: [KnowledgeFabricController],
  providers: [
    KnowledgeChecksumService,
    KnowledgeValidatorService,
    KnowledgeRegistryService,
    KnowledgeGraphService,
    KnowledgeFoundationService,
  ],
  exports: [
    KnowledgeChecksumService,
    KnowledgeValidatorService,
    KnowledgeRegistryService,
    KnowledgeGraphService,
    KnowledgeFoundationService,
  ],
})
export class KnowledgeFabricModule {}