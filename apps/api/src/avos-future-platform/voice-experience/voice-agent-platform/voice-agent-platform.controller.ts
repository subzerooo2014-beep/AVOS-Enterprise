import { Controller, Get } from '@nestjs/common';
import { VoiceAgentPlatformService } from './voice-agent-platform.service';

@Controller('avos/future/voice-experience/voice-agent-platform')
export class VoiceAgentPlatformController {
  constructor(private readonly service: VoiceAgentPlatformService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}