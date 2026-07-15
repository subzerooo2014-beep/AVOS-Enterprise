import { Module } from "@nestjs/common";
import { MarketplaceExecutionController } from "./marketplace-execution.controller";
import { MarketplaceExecutionService } from "./marketplace-execution.service";

@Module({
  controllers: [MarketplaceExecutionController],
  providers: [MarketplaceExecutionService],
  exports: [MarketplaceExecutionService],
})
export class MarketplaceExecutionModule {}