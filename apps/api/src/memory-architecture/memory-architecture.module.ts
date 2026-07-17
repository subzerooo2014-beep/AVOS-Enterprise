import { Module } from "@nestjs/common";
import { MemoryFoundationModule } from "./foundation";
import { MemoryStorageModule } from "./storage";
import { MemoryIntelligenceModule } from "./intelligence";
import { MemoryEvolutionModule } from "./evolution";
import { MemorySecurityModule } from "./security";
import { MemoryFederationModule } from "./federation";
import { MemoryAnalyticsModule } from "./analytics";
import { MemoryAiModule } from "./ai";
import { MemoryCertificationModule } from "./certification";

@Module({
  imports: [
    MemoryFoundationModule,
    MemoryStorageModule,
    MemoryIntelligenceModule,
    MemoryEvolutionModule,
    MemorySecurityModule,
    MemoryFederationModule,
    MemoryAnalyticsModule,
    MemoryAiModule,
    MemoryCertificationModule
  ],
  exports: [
    MemoryFoundationModule,
    MemoryStorageModule,
    MemoryIntelligenceModule,
    MemoryEvolutionModule,
    MemorySecurityModule,
    MemoryFederationModule,
    MemoryAnalyticsModule,
    MemoryAiModule,
    MemoryCertificationModule
  ],
})
export class MemoryArchitectureModule {}