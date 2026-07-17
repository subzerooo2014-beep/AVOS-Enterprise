import { Module } from '@nestjs/common';
import { DecisionMemoryController } from './decision-memory.controller';
import { DecisionMemoryService } from './decision-memory.service';

@Module({
  controllers: [DecisionMemoryController],
  providers: [DecisionMemoryService],
  exports: [DecisionMemoryService],
})
export class DecisionMemoryModule {}