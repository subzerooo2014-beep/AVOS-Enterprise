import { Module } from '@nestjs/common';
import { UniversalVoiceBusController } from './universal-voice-bus.controller';
import { UniversalVoiceBusService } from './universal-voice-bus.service';

@Module({
  controllers: [UniversalVoiceBusController],
  providers: [UniversalVoiceBusService],
  exports: [UniversalVoiceBusService],
})
export class UniversalVoiceBusModule {}