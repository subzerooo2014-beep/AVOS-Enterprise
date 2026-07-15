import { Module } from "@nestjs/common";
import { GrowthRevenueExpansionController } from "./growth-revenue-expansion.controller";
import { GrowthRevenueExpansionService } from "./growth-revenue-expansion.service";

@Module({
  controllers: [GrowthRevenueExpansionController],
  providers: [GrowthRevenueExpansionService],
  exports: [GrowthRevenueExpansionService],
})
export class GrowthRevenueExpansionModule {}