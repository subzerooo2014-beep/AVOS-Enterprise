import { Controller, Get } from '@nestjs/common';
import { KnowledgeCoreService } from './knowledge-core.service';

@Controller('avos/future/knowledge-memory/knowledge-core')
export class KnowledgeCoreController {
  constructor(private readonly service: KnowledgeCoreService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}