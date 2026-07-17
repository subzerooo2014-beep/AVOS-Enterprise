import { Module } from '@nestjs/common';
import { MarketplaceCreatorAiController } from './marketplace-creator-ai.controller';
import { MarketplaceCreatorAiService } from './marketplace-creator-ai.service';

@Module({
  controllers: [MarketplaceCreatorAiController],
  providers: [MarketplaceCreatorAiService],
  exports: [MarketplaceCreatorAiService],
})
export class MarketplaceCreatorAiModule {}