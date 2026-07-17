import { Module } from '@nestjs/common';
import { GrowthAiController } from './growth-ai.controller';
import { GrowthAiService } from './growth-ai.service';

@Module({
  controllers: [GrowthAiController],
  providers: [GrowthAiService],
  exports: [GrowthAiService],
})
export class GrowthAiModule {}