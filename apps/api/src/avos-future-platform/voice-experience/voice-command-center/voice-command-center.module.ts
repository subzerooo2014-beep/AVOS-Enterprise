import { Module } from '@nestjs/common';
import { VoiceCommandCenterController } from './voice-command-center.controller';
import { VoiceCommandCenterService } from './voice-command-center.service';

@Module({
  controllers: [VoiceCommandCenterController],
  providers: [VoiceCommandCenterService],
  exports: [VoiceCommandCenterService],
})
export class VoiceCommandCenterModule {}