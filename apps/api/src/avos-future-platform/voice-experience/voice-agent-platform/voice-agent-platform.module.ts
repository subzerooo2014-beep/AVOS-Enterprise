import { Module } from '@nestjs/common';
import { VoiceAgentPlatformController } from './voice-agent-platform.controller';
import { VoiceAgentPlatformService } from './voice-agent-platform.service';

@Module({
  controllers: [VoiceAgentPlatformController],
  providers: [VoiceAgentPlatformService],
  exports: [VoiceAgentPlatformService],
})
export class VoiceAgentPlatformModule {}