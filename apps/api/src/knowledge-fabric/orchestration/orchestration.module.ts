import { Module } from "@nestjs/common";
import { KnowledgeOrchestrationController } from "./orchestration.controller";
import { KnowledgeOrchestrationService } from "./orchestration.service";

@Module({ controllers: [KnowledgeOrchestrationController], providers: [KnowledgeOrchestrationService], exports: [KnowledgeOrchestrationService] })
export class KnowledgeOrchestrationModule {}