import { Module } from "@nestjs/common";
import { MetadataAnalyticsController } from "./analytics.controller";
import { MetadataAnalyticsService } from "./analytics.service";

@Module({ controllers: [MetadataAnalyticsController], providers: [MetadataAnalyticsService], exports: [MetadataAnalyticsService] })
export class MetadataAnalyticsModule {}