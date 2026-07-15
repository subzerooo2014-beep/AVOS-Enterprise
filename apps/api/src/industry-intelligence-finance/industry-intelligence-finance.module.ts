import { Module } from "@nestjs/common";
import { IndustryIntelligenceFinanceController } from "./industry-intelligence-finance.controller";
import { IndustryIntelligenceFinanceService } from "./industry-intelligence-finance.service";

@Module({
  controllers:[IndustryIntelligenceFinanceController],
  providers:[IndustryIntelligenceFinanceService],
  exports:[IndustryIntelligenceFinanceService],
})
export class IndustryIntelligenceFinanceModule {}