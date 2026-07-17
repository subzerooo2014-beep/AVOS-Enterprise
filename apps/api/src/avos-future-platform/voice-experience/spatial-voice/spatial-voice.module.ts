import { Module } from '@nestjs/common';
import { SpatialVoiceController } from './spatial-voice.controller';
import { SpatialVoiceService } from './spatial-voice.service';

@Module({
  controllers: [SpatialVoiceController],
  providers: [SpatialVoiceService],
  exports: [SpatialVoiceService],
})
export class SpatialVoiceModule {}