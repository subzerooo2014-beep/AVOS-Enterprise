import { Module } from "@nestjs/common";
import { SalesIntelligenceController } from "./sales-intelligence.controller";
import { SalesIntelligenceService } from "./sales-intelligence.service";

@Module({
  controllers: [SalesIntelligenceController],
  providers: [SalesIntelligenceService],
})
export class SalesIntelligenceModule {}
