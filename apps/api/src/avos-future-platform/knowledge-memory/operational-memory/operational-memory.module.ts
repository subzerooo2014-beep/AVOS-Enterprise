import { Module } from '@nestjs/common';
import { OperationalMemoryController } from './operational-memory.controller';
import { OperationalMemoryService } from './operational-memory.service';

@Module({
  controllers: [OperationalMemoryController],
  providers: [OperationalMemoryService],
  exports: [OperationalMemoryService],
})
export class OperationalMemoryModule {}