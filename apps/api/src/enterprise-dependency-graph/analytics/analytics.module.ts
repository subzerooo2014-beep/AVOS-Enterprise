import { Module } from "@nestjs/common";
import { DependencyAnalyticsController } from "./analytics.controller";
import { DependencyAnalyticsService } from "./analytics.service";

@Module({ controllers: [DependencyAnalyticsController], providers: [DependencyAnalyticsService], exports: [DependencyAnalyticsService] })
export class DependencyAnalyticsModule {}