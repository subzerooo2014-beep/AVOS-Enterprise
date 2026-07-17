import { Module } from "@nestjs/common";
import { MemoryAnalyticsController } from "./analytics.controller";
import { MemoryAnalyticsService } from "./analytics.service";

@Module({ controllers: [MemoryAnalyticsController], providers: [MemoryAnalyticsService], exports: [MemoryAnalyticsService] })
export class MemoryAnalyticsModule {}