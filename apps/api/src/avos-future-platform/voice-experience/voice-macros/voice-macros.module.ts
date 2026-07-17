import { Module } from '@nestjs/common';
import { VoiceMacrosController } from './voice-macros.controller';
import { VoiceMacrosService } from './voice-macros.service';

@Module({
  controllers: [VoiceMacrosController],
  providers: [VoiceMacrosService],
  exports: [VoiceMacrosService],
})
export class VoiceMacrosModule {}