import { Module } from '@nestjs/common';
import { RetentionAiController } from './retention-ai.controller';
import { RetentionAiService } from './retention-ai.service';

@Module({
  controllers: [RetentionAiController],
  providers: [RetentionAiService],
  exports: [RetentionAiService],
})
export class RetentionAiModule {}