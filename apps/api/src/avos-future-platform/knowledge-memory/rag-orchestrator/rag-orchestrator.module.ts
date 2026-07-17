import { Module } from '@nestjs/common';
import { RagOrchestratorController } from './rag-orchestrator.controller';
import { RagOrchestratorService } from './rag-orchestrator.service';

@Module({
  controllers: [RagOrchestratorController],
  providers: [RagOrchestratorService],
  exports: [RagOrchestratorService],
})
export class RagOrchestratorModule {}