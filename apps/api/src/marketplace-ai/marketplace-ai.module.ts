import { Module } from "@nestjs/common";
import { MarketplaceAiController } from "./marketplace-ai.controller";
import { MarketplaceAiService } from "./marketplace-ai.service";

@Module({
  controllers: [MarketplaceAiController],
  providers: [MarketplaceAiService],
  exports: [MarketplaceAiService],
})
export class MarketplaceAiModule {}