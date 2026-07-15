import { Module } from "@nestjs/common";
import { MarketplacePlatformController } from "./marketplace-platform.controller";
import { MarketplacePlatformService } from "./marketplace-platform.service";

@Module({
  controllers: [MarketplacePlatformController],
  providers: [MarketplacePlatformService],
  exports: [MarketplacePlatformService],
})
export class MarketplacePlatformModule {}