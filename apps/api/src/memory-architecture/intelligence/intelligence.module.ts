import { Module } from "@nestjs/common";
import { MemoryIntelligenceController } from "./intelligence.controller";
import { MemoryIntelligenceService } from "./intelligence.service";

@Module({ controllers: [MemoryIntelligenceController], providers: [MemoryIntelligenceService], exports: [MemoryIntelligenceService] })
export class MemoryIntelligenceModule {}