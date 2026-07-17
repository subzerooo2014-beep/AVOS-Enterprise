import { Module } from '@nestjs/common';
import { AiRadioController } from './ai-radio.controller';
import { AiRadioService } from './ai-radio.service';

@Module({
  controllers: [AiRadioController],
  providers: [AiRadioService],
  exports: [AiRadioService],
})
export class AiRadioModule {}