import { Module } from '@nestjs/common';
import { AiCeoAssistantController } from './ai-ceo-assistant.controller';
import { AiCeoAssistantService } from './ai-ceo-assistant.service';

@Module({
  controllers: [AiCeoAssistantController],
  providers: [AiCeoAssistantService],
  exports: [AiCeoAssistantService],
})
export class AiCeoAssistantModule {}