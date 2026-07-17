import { Module } from "@nestjs/common";
import { DigitalGenomeIntelligenceController } from "./intelligence.controller";
import { DigitalGenomeIntelligenceService } from "./intelligence.service";

@Module({
  controllers: [DigitalGenomeIntelligenceController],
  providers: [DigitalGenomeIntelligenceService],
  exports: [DigitalGenomeIntelligenceService],
})
export class DigitalGenomeIntelligenceModule {}