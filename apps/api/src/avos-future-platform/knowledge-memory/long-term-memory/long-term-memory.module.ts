import { Module } from '@nestjs/common';
import { LongTermMemoryController } from './long-term-memory.controller';
import { LongTermMemoryService } from './long-term-memory.service';

@Module({
  controllers: [LongTermMemoryController],
  providers: [LongTermMemoryService],
  exports: [LongTermMemoryService],
})
export class LongTermMemoryModule {}