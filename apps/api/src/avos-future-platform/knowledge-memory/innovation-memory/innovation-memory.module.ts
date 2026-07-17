import { Module } from '@nestjs/common';
import { InnovationMemoryController } from './innovation-memory.controller';
import { InnovationMemoryService } from './innovation-memory.service';

@Module({
  controllers: [InnovationMemoryController],
  providers: [InnovationMemoryService],
  exports: [InnovationMemoryService],
})
export class InnovationMemoryModule {}