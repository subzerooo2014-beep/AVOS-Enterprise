import { Module } from '@nestjs/common';
import { StreamingIntelligenceController } from './streaming-intelligence.controller';
import { StreamingIntelligenceService } from './streaming-intelligence.service';

@Module({
  controllers: [StreamingIntelligenceController],
  providers: [StreamingIntelligenceService],
  exports: [StreamingIntelligenceService],
})
export class StreamingIntelligenceModule {}