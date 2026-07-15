import { Module } from "@nestjs/common";
import { IndustryCommerceRevenueController } from "./industry-commerce-revenue.controller";
import { IndustryCommerceRevenueService } from "./industry-commerce-revenue.service";

@Module({
  controllers: [IndustryCommerceRevenueController],
  providers: [IndustryCommerceRevenueService],
  exports: [IndustryCommerceRevenueService],
})
export class IndustryCommerceRevenueModule {}