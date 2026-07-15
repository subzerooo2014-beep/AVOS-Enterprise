import { Module } from "@nestjs/common";
import { FinancialPlatformController } from "./financial-platform.controller";
import { FinancialPlatformService } from "./financial-platform.service";

@Module({
  controllers: [FinancialPlatformController],
  providers: [FinancialPlatformService],
  exports: [FinancialPlatformService],
})
export class FinancialPlatformModule {}