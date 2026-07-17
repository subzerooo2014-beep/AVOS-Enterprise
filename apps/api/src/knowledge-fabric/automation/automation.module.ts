import { Module } from "@nestjs/common";
import { KnowledgeAutomationController } from "./automation.controller";
import { KnowledgeAutomationService } from "./automation.service";

@Module({ controllers: [KnowledgeAutomationController], providers: [KnowledgeAutomationService], exports: [KnowledgeAutomationService] })
export class KnowledgeAutomationModule {}