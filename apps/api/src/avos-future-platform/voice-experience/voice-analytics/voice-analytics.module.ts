import { Module } from '@nestjs/common';
import { VoiceAnalyticsController } from './voice-analytics.controller';
import { VoiceAnalyticsService } from './voice-analytics.service';

@Module({
  controllers: [VoiceAnalyticsController],
  providers: [VoiceAnalyticsService],
  exports: [VoiceAnalyticsService],
})
export class VoiceAnalyticsModule {}