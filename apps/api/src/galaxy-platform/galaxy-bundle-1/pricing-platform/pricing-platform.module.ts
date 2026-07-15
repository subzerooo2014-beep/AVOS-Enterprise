import { Module } from "@nestjs/common";
import { PricingPlatformController } from "./pricing-platform.controller";
import { PricingPlatformService } from "./pricing-platform.service";

@Module({
  controllers: [PricingPlatformController],
  providers: [PricingPlatformService],
  exports: [PricingPlatformService],
})
export class PricingPlatformModule {}