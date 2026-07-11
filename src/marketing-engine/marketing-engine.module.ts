import { Module } from "@nestjs/common";
import { MarketingEngineController } from "./marketing-engine.controller";
import { MarketingEngineService } from "./marketing-engine.service";

@Module({
  controllers: [MarketingEngineController],
  providers: [MarketingEngineService],
  exports: [MarketingEngineService],
})
export class MarketingEngineModule {}
