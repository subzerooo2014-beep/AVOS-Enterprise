import { Module } from "@nestjs/common";
import { RevenueCommerceController } from "./revenue-commerce.controller";
import { RevenueCommerceService } from "./revenue-commerce.service";

@Module({
  controllers: [RevenueCommerceController],
  providers: [RevenueCommerceService],
  exports: [RevenueCommerceService],
})
export class RevenueCommerceModule {}