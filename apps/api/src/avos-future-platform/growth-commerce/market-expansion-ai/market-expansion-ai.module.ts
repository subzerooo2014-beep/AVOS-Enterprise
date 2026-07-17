import { Module } from '@nestjs/common';
import { MarketExpansionAiController } from './market-expansion-ai.controller';
import { MarketExpansionAiService } from './market-expansion-ai.service';

@Module({
  controllers: [MarketExpansionAiController],
  providers: [MarketExpansionAiService],
  exports: [MarketExpansionAiService],
})
export class MarketExpansionAiModule {}