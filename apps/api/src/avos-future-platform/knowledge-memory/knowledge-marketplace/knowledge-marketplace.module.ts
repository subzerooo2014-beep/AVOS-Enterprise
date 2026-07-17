import { Module } from '@nestjs/common';
import { KnowledgeMarketplaceController } from './knowledge-marketplace.controller';
import { KnowledgeMarketplaceService } from './knowledge-marketplace.service';

@Module({
  controllers: [KnowledgeMarketplaceController],
  providers: [KnowledgeMarketplaceService],
  exports: [KnowledgeMarketplaceService],
})
export class KnowledgeMarketplaceModule {}