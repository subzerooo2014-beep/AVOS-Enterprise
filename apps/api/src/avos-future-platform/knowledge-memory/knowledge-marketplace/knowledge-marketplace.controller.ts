import { Controller, Get } from '@nestjs/common';
import { KnowledgeMarketplaceService } from './knowledge-marketplace.service';

@Controller('avos/future/knowledge-memory/knowledge-marketplace')
export class KnowledgeMarketplaceController {
  constructor(private readonly service: KnowledgeMarketplaceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}