import { Module } from "@nestjs/common";
import { LanguageMemoryFoundationController } from "./language-memory-foundation.controller";
import { LanguageMemoryFoundationService } from "./language-memory-foundation.service";

import { DialectDetectionService } from "./services/dialect-detection.service";
import { DialectNormalizationService } from "./services/dialect-normalization.service";
import { DialectTranslationService } from "./services/dialect-translation.service";
import { FushaDialectConversionService } from "./services/fusha-dialect-conversion.service";
import { DialectProfileService } from "./services/dialect-profile.service";
import { VoiceProfileService } from "./services/voice-profile.service";
import { VoiceLanguageIntelligenceService } from "./services/voice-language-intelligence.service";
import { LiveInterpreterService } from "./services/live-interpreter.service";
import { VoiceTranslationService } from "./services/voice-translation.service";
import { CulturalProfileService } from "./services/cultural-profile.service";
import { RegionalAiBehaviorService } from "./services/regional-ai-behavior.service";
import { CrossLanguageMemoryService } from "./services/cross-language-memory.service";
import { CrossLanguageRagService } from "./services/cross-language-rag.service";
import { ShortTermMemoryService } from "./services/short-term-memory.service";
import { LongTermMemoryService } from "./services/long-term-memory.service";
import { EpisodicMemoryService } from "./services/episodic-memory.service";
import { SemanticMemoryService } from "./services/semantic-memory.service";
import { ProceduralMemoryService } from "./services/procedural-memory.service";
import { SharedMemoryService } from "./services/shared-memory.service";
import { MemoryConflictResolverService } from "./services/memory-conflict-resolver.service";
import { MemoryCompressionService } from "./services/memory-compression.service";
import { MemoryRankingService } from "./services/memory-ranking.service";
import { MemoryRetrievalService } from "./services/memory-retrieval.service";
import { MemoryReplayService } from "./services/memory-replay.service";
import { MemorySnapshotService } from "./services/memory-snapshot.service";
import { MemoryVersioningService } from "./services/memory-versioning.service";
import { MemoryGovernanceService } from "./services/memory-governance.service";
import { MemoryAnalyticsService } from "./services/memory-analytics.service";
import { LanguageMemoryDashboardService } from "./services/language-memory-dashboard.service";

import { DialectIntelligenceRuntime } from "./runtime/dialect-intelligence.runtime";
import { VoiceLanguageRuntime } from "./runtime/voice-language.runtime";
import { CulturalIntelligenceRuntime } from "./runtime/cultural-intelligence.runtime";
import { CrossLanguageRagRuntime } from "./runtime/cross-language-rag.runtime";
import { ShortTermMemoryRuntime } from "./runtime/short-term-memory.runtime";
import { LongTermMemoryRuntime } from "./runtime/long-term-memory.runtime";
import { SharedMemoryRuntime } from "./runtime/shared-memory.runtime";
import { MemoryRetrievalRuntime } from "./runtime/memory-retrieval.runtime";
import { MemoryCompressionRuntime } from "./runtime/memory-compression.runtime";
import { MemoryGovernanceRuntime } from "./runtime/memory-governance.runtime";

@Module({
  controllers:[LanguageMemoryFoundationController],
  providers:[
    LanguageMemoryFoundationService,
    DialectDetectionService,DialectNormalizationService,DialectTranslationService,FushaDialectConversionService,
    DialectProfileService,VoiceProfileService,VoiceLanguageIntelligenceService,LiveInterpreterService,
    VoiceTranslationService,CulturalProfileService,RegionalAiBehaviorService,CrossLanguageMemoryService,
    CrossLanguageRagService,ShortTermMemoryService,LongTermMemoryService,EpisodicMemoryService,
    SemanticMemoryService,ProceduralMemoryService,SharedMemoryService,MemoryConflictResolverService,
    MemoryCompressionService,MemoryRankingService,MemoryRetrievalService,MemoryReplayService,
    MemorySnapshotService,MemoryVersioningService,MemoryGovernanceService,MemoryAnalyticsService,
    LanguageMemoryDashboardService,
    DialectIntelligenceRuntime,VoiceLanguageRuntime,CulturalIntelligenceRuntime,CrossLanguageRagRuntime,
    ShortTermMemoryRuntime,LongTermMemoryRuntime,SharedMemoryRuntime,MemoryRetrievalRuntime,
    MemoryCompressionRuntime,MemoryGovernanceRuntime
  ],
  exports:[LanguageMemoryFoundationService],
})
export class LanguageMemoryFoundationModule {}
