import { Module } from '@nestjs/common';
import { ExplainableAiCenterController } from './explainable-ai-center.controller';
import { ExplainableAiCenterService } from './explainable-ai-center.service';

@Module({
  controllers: [ExplainableAiCenterController],
  providers: [ExplainableAiCenterService],
  exports: [ExplainableAiCenterService],
})
export class ExplainableAiCenterModule {}