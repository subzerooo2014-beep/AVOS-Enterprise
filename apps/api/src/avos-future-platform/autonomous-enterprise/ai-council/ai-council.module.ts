import { Module } from '@nestjs/common';
import { AiCouncilController } from './ai-council.controller';
import { AiCouncilService } from './ai-council.service';

@Module({
  controllers: [AiCouncilController],
  providers: [AiCouncilService],
  exports: [AiCouncilService],
})
export class AiCouncilModule {}