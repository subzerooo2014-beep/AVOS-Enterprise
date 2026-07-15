import { Module } from "@nestjs/common";
import { IndustryCustomerGrowthController } from "./industry-customer-growth.controller";
import { IndustryCustomerGrowthService } from "./industry-customer-growth.service";

@Module({
  controllers: [IndustryCustomerGrowthController],
  providers: [IndustryCustomerGrowthService],
  exports: [IndustryCustomerGrowthService],
})
export class IndustryCustomerGrowthModule {}