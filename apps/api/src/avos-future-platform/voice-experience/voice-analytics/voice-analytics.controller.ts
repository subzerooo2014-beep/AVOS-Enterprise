import { Controller, Get } from '@nestjs/common';
import { VoiceAnalyticsService } from './voice-analytics.service';

@Controller('avos/future/voice-experience/voice-analytics')
export class VoiceAnalyticsController {
  constructor(private readonly service: VoiceAnalyticsService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}