import { Body, Controller, Get, Post } from "@nestjs/common";
import { LanguageMemoryFoundationService } from "./language-memory-foundation.service";
import { DialectDetectionService } from "./services/dialect-detection.service";
import { DialectNormalizationService } from "./services/dialect-normalization.service";
import { DialectTranslationService } from "./services/dialect-translation.service";
import { FushaDialectConversionService } from "./services/fusha-dialect-conversion.service";
import { DialectProfileService } from "./services/dialect-profile.service";
import { VoiceProfileService } from "./services/voice-profile.service";
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

@Controller("language-memory-foundation")
export class LanguageMemoryFoundationController {
  constructor(
    private readonly os: LanguageMemoryFoundationService,
    private readonly dialectDetection: DialectDetectionService,
    private readonly dialectNormalization: DialectNormalizationService,
    private readonly dialectTranslation: DialectTranslationService,
    private readonly fushaConversion: FushaDialectConversionService,
    private readonly dialectProfiles: DialectProfileService,
    private readonly voiceProfiles: VoiceProfileService,
    private readonly liveInterpreter: LiveInterpreterService,
    private readonly voiceTranslation: VoiceTranslationService,
    private readonly culturalProfiles: CulturalProfileService,
    private readonly regionalBehavior: RegionalAiBehaviorService,
    private readonly crossLanguageMemory: CrossLanguageMemoryService,
    private readonly crossLanguageRag: CrossLanguageRagService,
    private readonly shortTermMemory: ShortTermMemoryService,
    private readonly longTermMemory: LongTermMemoryService,
    private readonly episodicMemory: EpisodicMemoryService,
    private readonly semanticMemory: SemanticMemoryService,
    private readonly proceduralMemory: ProceduralMemoryService,
    private readonly sharedMemory: SharedMemoryService,
    private readonly conflictResolver: MemoryConflictResolverService,
    private readonly compression: MemoryCompressionService,
    private readonly ranking: MemoryRankingService,
    private readonly retrieval: MemoryRetrievalService,
    private readonly replay: MemoryReplayService,
    private readonly snapshots: MemorySnapshotService,
    private readonly versions: MemoryVersioningService,
    private readonly governance: MemoryGovernanceService,
    private readonly analytics: MemoryAnalyticsService,
    private readonly dashboard: LanguageMemoryDashboardService,
  ) {}

  @Get("health") health(){ return this.os.health(); }
  @Post("dialects/detect") detectDialect(@Body() b:any){ return {success:true,result:this.dialectDetection.create(b)}; }
  @Post("dialects/normalize") normalizeDialect(@Body() b:any){ return {success:true,result:this.dialectNormalization.create(b)}; }
  @Post("dialects/translate") translateDialect(@Body() b:any){ return {success:true,result:this.dialectTranslation.create(b)}; }
  @Post("dialects/fusha-convert") fushaDialectConvert(@Body() b:any){ return {success:true,result:this.fushaConversion.create(b)}; }
  @Post("dialect-profiles") dialectProfile(@Body() b:any){ return {success:true,result:this.dialectProfiles.create(b)}; }
  @Post("voice-profiles") voiceProfile(@Body() b:any){ return {success:true,result:this.voiceProfiles.create(b)}; }
  @Post("live-interpreter") liveInterpretation(@Body() b:any){ return {success:true,result:this.liveInterpreter.create(b)}; }
  @Post("voice-translation") voiceTranslate(@Body() b:any){ return {success:true,result:this.voiceTranslation.create(b)}; }
  @Post("cultural-profiles") culturalProfile(@Body() b:any){ return {success:true,result:this.culturalProfiles.create(b)}; }
  @Post("regional-ai-behavior") regionalAi(@Body() b:any){ return {success:true,result:this.regionalBehavior.create(b)}; }
  @Post("cross-language-memory") crossLanguageMemoryEntry(@Body() b:any){ return {success:true,result:this.crossLanguageMemory.create(b)}; }
  @Post("cross-language-rag") crossLanguageRagEntry(@Body() b:any){ return {success:true,result:this.crossLanguageRag.create(b)}; }
  @Post("memory/short-term") createShortTermMemory(@Body() b:any){ return {success:true,result:this.shortTermMemory.create(b)}; }
  @Post("memory/long-term") createLongTermMemory(@Body() b:any){ return {success:true,result:this.longTermMemory.create(b)}; }
  @Post("memory/episodic") createEpisodicMemory(@Body() b:any){ return {success:true,result:this.episodicMemory.create(b)}; }
  @Post("memory/semantic") createSemanticMemory(@Body() b:any){ return {success:true,result:this.semanticMemory.create(b)}; }
  @Post("memory/procedural") createProceduralMemory(@Body() b:any){ return {success:true,result:this.proceduralMemory.create(b)}; }
  @Post("memory/shared") createSharedMemory(@Body() b:any){ return {success:true,result:this.sharedMemory.create(b)}; }
  @Post("memory/conflicts") resolveMemoryConflict(@Body() b:any){ return {success:true,result:this.conflictResolver.create(b)}; }
  @Post("memory/compress") compressMemory(@Body() b:any){ return {success:true,result:this.compression.create(b)}; }
  @Post("memory/rank") rankMemory(@Body() b:any){ return {success:true,result:this.ranking.create(b)}; }
  @Post("memory/retrieve") retrieveMemory(@Body() b:any){ return {success:true,result:this.retrieval.create(b)}; }
  @Post("memory/replay") replayMemory(@Body() b:any){ return {success:true,result:this.replay.create(b)}; }
  @Post("memory/snapshots") createMemorySnapshot(@Body() b:any){ return {success:true,result:this.snapshots.create(b)}; }
  @Post("memory/versions") createMemoryVersion(@Body() b:any){ return {success:true,result:this.versions.create(b)}; }
  @Post("memory/governance") memoryGovernance(@Body() b:any){ return {success:true,result:this.governance.create(b)}; }
  @Post("memory/analytics") memoryAnalytics(@Body() b:any){ return {success:true,result:this.analytics.create(b)}; }
  @Get("operations/dashboard") operations(){ return {success:true,dashboard:this.dashboard.summary()}; }
}
