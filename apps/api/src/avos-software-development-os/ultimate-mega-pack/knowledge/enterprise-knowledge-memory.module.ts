import { Module } from '@nestjs/common';
import { EnterpriseKnowledgeMemoryService } from './enterprise-knowledge-memory.service';

@Module({
  providers: [EnterpriseKnowledgeMemoryService],
  exports: [EnterpriseKnowledgeMemoryService],
})
export class EnterpriseKnowledgeMemoryModule {}
