import { Module } from "@nestjs/common";
import { KnowledgeAnalyticsController } from "./analytics.controller";
import { KnowledgeAnalyticsService } from "./analytics.service";

@Module({ controllers: [KnowledgeAnalyticsController], providers: [KnowledgeAnalyticsService], exports: [KnowledgeAnalyticsService] })
export class KnowledgeAnalyticsModule {}