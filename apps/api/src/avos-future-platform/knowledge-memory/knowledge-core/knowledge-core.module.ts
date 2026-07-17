import { Module } from '@nestjs/common';
import { KnowledgeCoreController } from './knowledge-core.controller';
import { KnowledgeCoreService } from './knowledge-core.service';

@Module({
  controllers: [KnowledgeCoreController],
  providers: [KnowledgeCoreService],
  exports: [KnowledgeCoreService],
})
export class KnowledgeCoreModule {}