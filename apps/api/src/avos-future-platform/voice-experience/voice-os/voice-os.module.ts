import { Module } from '@nestjs/common';
import { VoiceOsController } from './voice-os.controller';
import { VoiceOsService } from './voice-os.service';

@Module({
  controllers: [VoiceOsController],
  providers: [VoiceOsService],
  exports: [VoiceOsService],
})
export class VoiceOsModule {}