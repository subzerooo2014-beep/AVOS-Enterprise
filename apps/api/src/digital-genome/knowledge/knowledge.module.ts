import { Module } from "@nestjs/common";
import { DigitalGenomeKnowledgeController } from "./knowledge.controller";
import { DigitalGenomeKnowledgeService } from "./knowledge.service";

@Module({
  controllers: [DigitalGenomeKnowledgeController],
  providers: [DigitalGenomeKnowledgeService],
  exports: [DigitalGenomeKnowledgeService],
})
export class DigitalGenomeKnowledgeModule {}