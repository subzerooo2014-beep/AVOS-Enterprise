import { Module } from '@nestjs/common';
import { VoiceAuthenticationCenterController } from './voice-authentication-center.controller';
import { VoiceAuthenticationCenterService } from './voice-authentication-center.service';

@Module({
  controllers: [VoiceAuthenticationCenterController],
  providers: [VoiceAuthenticationCenterService],
  exports: [VoiceAuthenticationCenterService],
})
export class VoiceAuthenticationCenterModule {}