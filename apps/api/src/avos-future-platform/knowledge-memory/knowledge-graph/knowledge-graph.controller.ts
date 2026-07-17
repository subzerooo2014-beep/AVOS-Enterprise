import { Controller, Get } from '@nestjs/common';
import { KnowledgeGraphService } from './knowledge-graph.service';

@Controller('avos/future/knowledge-memory/knowledge-graph')
export class KnowledgeGraphController {
  constructor(private readonly service: KnowledgeGraphService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}