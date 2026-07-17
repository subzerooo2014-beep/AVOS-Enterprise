import { Controller, Get } from '@nestjs/common';
import { RagOrchestratorService } from './rag-orchestrator.service';

@Controller('avos/future/knowledge-memory/rag-orchestrator')
export class RagOrchestratorController {
  constructor(private readonly service: RagOrchestratorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}